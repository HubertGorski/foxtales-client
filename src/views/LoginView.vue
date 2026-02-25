<script setup lang="ts">
  import { useRouter } from 'vue-router';
  import { ROUTE_PATH } from '@/router/routeEnums';
  import { useForm, useField } from 'vee-validate';
  import * as yup from 'yup';
  import { computed, ref } from 'vue';
  import { userService } from '@/api/services/UserService';
  import { useI18n } from 'vue-i18n';
  import { useViewStore } from '@/stores/viewStore';
  import HubBtn from '@/components/hubComponents/HubBtn.vue';
  import HubInput from '@/components/hubComponents/HubInput.vue';

  const { t } = useI18n();
  const router = useRouter();

  type FormFields = 'email' | 'password';
  const isLoading = ref<boolean>(false);

  const schema = yup.object({
    email: yup.string().required(t('auth.emailIsRequired')).email(t('auth.emailFormatIsIncorrect')),
    password: yup.string().required(t('auth.passwordIsRequired')),
  });

  const { handleSubmit, setFieldError } = useForm({
    validationSchema: schema,
    initialValues: {
      email: '',
      password: '',
    },
  });

  const { value: email, errorMessage: emailError } = useField<string>('email');
  const { value: password, errorMessage: passwordError } = useField<string>('password');

  const navigateBack = () => {
    router.push(ROUTE_PATH.HOME);
  };

  const onSubmit = handleSubmit(async values => {
    if (isLoading.value) {
      return;
    }

    isLoading.value = true;
    try {
      await userService.login(values.email, values.password);
      router.push(ROUTE_PATH.MENU);
    } catch (err: any) {
      const data = err?.response?.data;
      if (data?.errors) {
        Object.entries(data.errors).forEach(([field, messages]: [string, any]) => {
          if (Array.isArray(messages)) {
            setFieldError(field.toLowerCase() as FormFields, t(`auth.${messages[0]}`));
          }
        });
      }
    } finally {
      isLoading.value = false;
    }
  });

  const isKeyboardOpen = computed(() => {
    return useViewStore().getIsKeyboardOpen();
  });

  const isBtnDisabled = computed((): boolean => {
    return isLoading.value || !!emailError.value || !!passwordError.value;
  });
</script>

<template>
  <div class="loginView" :class="{ isFocused: isKeyboardOpen }">
    <img src="@/assets/imgs/4.webp" alt="Lisek" class="loginView_fox" />
    <form class="creamCard" @submit.prevent="onSubmit">
      <h1 class="loginView_title">{{ $t('auth.loginTitle') }}</h1>
      <HubInput
        v-model="email"
        :placeholder="$t('auth.email')"
        class="loginView_input"
        :errorMessages="emailError"
        @enter="onSubmit"
      />
      <HubInput
        v-model="password"
        :placeholder="$t('auth.password')"
        textType="password"
        class="loginView_input"
        :errorMessages="passwordError"
        @enter="onSubmit"
      />
      <div class="loginView_actions">
        <HubBtn text="back2" :action="navigateBack" />
        <HubBtn
          text="auth.logIn"
          isOrange
          :loading="isLoading"
          :disabled="isBtnDisabled"
          :action="onSubmit"
        />
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
  @use '@/assets/styles/variables' as *;

  .loginView {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 0 16px;
    background: $mainBackground;

    &.isFocused {
      .loginView_fox {
        transition: all 0.4s ease-in-out;
        height: 0;
        top: -4px;
      }
    }

    .creamCard {
      padding: 24px;
    }

    &_fox {
      position: relative;
      top: 8px;
      height: 285px;
    }

    &_title {
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 12px;
      color: $mainBrownColor;
    }

    &_input {
      width: 100%;
      padding: 8px 0;
    }

    &_actions {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      margin-top: 12px;
    }
  }
</style>
