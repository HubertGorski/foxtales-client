<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { ROUTE_PATH } from '@/router/routeEnums';
  import { useI18n } from 'vue-i18n';
  import WhiteCard from '@/components/WhiteCard.vue';
  import HubInputBox from '@/components/hubComponents/HubInputBox.vue';
  import NavigationBtns from '@/components/NavigationBtns.vue';
  import { useField, useForm } from 'vee-validate';
  import { userService } from '@/api/services/UserService';
  import HubCheckbox from '@/components/hubComponents/HubCheckbox.vue';
  import Terms from '@/components/Terms.vue';
  import { useLoading } from '@/composables/useLoading';

  type FormFields = 'username' | 'termsaccepted';

  const { t } = useI18n();
  const router = useRouter();
  const { loading, withLoading } = useLoading();

  const { handleSubmit, setFieldError } = useForm({
    initialValues: {
      termsaccepted: false,
      username: '',
    },
  });
  const { value: username, errorMessage: usernameError } = useField<string>('username');
  const { value: termsAccepted, errorMessage: termsAcceptedError } =
    useField<boolean>('termsaccepted');
  const inputRef = ref<any>(null);

  const scrollToInput = () => {
    setTimeout(() => {
      inputRef.value?.$el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 200);
  };

  const onSubmit = handleSubmit(async values => {
    try {
      await withLoading(async () => {
        await userService.registerTmpUser(values.username, values.termsaccepted);
        router.push(ROUTE_PATH.MENU);
      });
    } catch (err: any) {
      const data = err?.response?.data;
      if (data?.errors) {
        Object.entries(data.errors).forEach(([field, messages]: [string, any]) => {
          if (Array.isArray(messages)) {
            setFieldError(field.toLowerCase() as FormFields, t(`auth.${messages[0]}`));
          }
        });
      }
    }
  });

  const back = () => {
    router.push(ROUTE_PATH.HOME);
  };
</script>

<template>
  <div class="tryWithoutAccountView">
    <div class="tryWithoutAccountView_content">
      <WhiteCard :header="t('attention')">
        <p class="alert">{{ t('tryWithoutAccountView.alert') }}</p>
      </WhiteCard>
      <HubInputBox
        ref="inputRef"
        v-model="username"
        :error-messages="usernameError"
        title="auth.username"
        btnText="tryWithoutAccount"
        :btnAction="onSubmit"
        :btnLoading="loading"
        withFoxImg
        @focus="scrollToInput"
      >
        <HubCheckbox v-model="termsAccepted" :error-messages="termsAcceptedError">
          <Terms />
        </HubCheckbox>
      </HubInputBox>
    </div>
    <NavigationBtns class="navBtns" btn="back" btn2="register" :btnCustomAction="back" />
  </div>
</template>

<style lang="scss" scoped>
  @use '@/assets/styles/variables' as *;

  .tryWithoutAccountView {
    min-height: 100%;
    background: $mainBackground;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    position: relative;
    overflow: visible;

    &_content {
      padding: 0 24px;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 36px;
    }

    .alert {
      font-size: 14px;
      font-style: italic;
      color: $lightGrayColor;
      letter-spacing: 0.5px;
    }

    .navBtns {
      width: 100%;
      padding: 8px 12px;
    }
  }
</style>
