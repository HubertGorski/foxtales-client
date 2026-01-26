<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { ROUTE_PATH } from '@/router/routeEnums';
  import { userService } from '@/api/services/UserService';
  import { useField, useForm } from 'vee-validate';
  import { useI18n } from 'vue-i18n';
  import HubBtn from '@/components/hubComponents/HubBtn.vue';
  import HubTooltip from '@/components/hubComponents/HubTooltip.vue';
  import HubCheckbox from '@/components/hubComponents/HubCheckbox.vue';
  import Terms from '@/components/Terms.vue';

  type FormFields = 'email' | 'username' | 'password' | 'confirmpassword' | 'termsaccepted';

  const { t } = useI18n();
  const router = useRouter();

  const step = ref(0);

  const { handleSubmit, setFieldError } = useForm({
    initialValues: {
      termsaccepted: false,
      email: '',
      confirmpassword: '',
      password: '',
      username: '',
    },
  });
  const { value: email, errorMessage: emailError } = useField('email');
  const { value: confirmpassword, errorMessage: confirmpasswordError } =
    useField('confirmpassword');
  const { value: password, errorMessage: passwordError } = useField('password');
  const { value: username, errorMessage: usernameError } = useField('username');
  const { value: termsAccepted, errorMessage: termsAcceptedError } =
    useField<boolean>('termsaccepted');

  const onSubmit = handleSubmit(async values => {
    try {
      await userService.register(
        values.email,
        values.username,
        values.password,
        values.confirmpassword,
        values.termsaccepted
      );
      router.push(ROUTE_PATH.WELCOME);
    } catch (err: any) {
      step.value = 0;
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

  const navigateBack = () => {
    if (step.value === 2) {
      step.value = 1;
      return;
    }
    router.back();
  };

  const areErrorExistInPart1 = computed(() => {
    return !!(usernameError.value || emailError.value);
  });

  const areErrorExistInPart2 = computed(() => {
    return !!(passwordError.value || confirmpasswordError.value);
  });

  const areErrorExist = computed(() => {
    return !!(areErrorExistInPart1.value || areErrorExistInPart2.value);
  });

  const isCreateBtnDisabled = computed(() => {
    return !!(!password.value || !confirmpassword.value || areErrorExist.value);
  });

  const isTooltipDisabled = computed(() => {
    return !!(
      username.value &&
      email.value &&
      password.value &&
      confirmpassword.value &&
      !areErrorExist.value
    );
  });

  watch(areErrorExist, () => {
    if (areErrorExist.value && step.value == 2) {
      step.value = 0;
    }
  });
</script>

<template>
  <div class="registerView">
    <form class="creamCard" @submit.prevent="onSubmit">
      <h1 class="registerView_title">{{ $t('registerTitle') }}</h1>
      <div v-if="step === 1 || step === 0">
        <v-text-field
          v-model="username"
          :label="$t('auth.username')"
          class="registerView_input"
          :error-messages="usernameError"
          @focus="step = 1"
        />
        <v-text-field
          v-model="email"
          :label="$t('auth.email')"
          class="registerView_input"
          :error-messages="emailError"
          @focus="step = 1"
        />
      </div>
      <div v-if="step === 2 || step === 0">
        <v-text-field
          v-model="password"
          :label="$t('auth.password')"
          type="password"
          class="registerView_input"
          :error-messages="passwordError"
          @focus="step = 2"
        />
        <v-text-field
          v-model="confirmpassword"
          :label="$t('auth.repeatPassword')"
          type="password"
          class="registerView_input"
          :error-messages="confirmpasswordError"
          @focus="step = 2"
        />
      </div>
      <HubCheckbox
        v-model="termsAccepted"
        class="registerView_terms"
        :error-messages="termsAcceptedError"
      >
        <Terms />
      </HubCheckbox>
      <div class="registerView_actions">
        <HubBtn :text="$t('back2')" :action="navigateBack" />
        <HubTooltip
          v-if="step === 1"
          :tooltipText="$t('auth.fillFormCorrectly')"
          :tooltipDisabled="!(!username || !email || areErrorExistInPart1)"
        >
          <HubBtn
            :text="$t('next')"
            :action="() => (step = 2)"
            :disabled="!username || !email || areErrorExistInPart1"
            isOrange
          />
        </HubTooltip>
        <HubTooltip
          v-if="step === 2 || step === 0"
          :tooltipText="$t('auth.fillFormCorrectly')"
          :tooltipDisabled="isTooltipDisabled"
        >
          <HubBtn
            :text="$t('create')"
            :action="onSubmit"
            :disabled="isCreateBtnDisabled"
            isOrange
          />
        </HubTooltip>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
  @import '@/assets/styles/variables';

  .registerView {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    background: $mainBackground;
    padding: 80px 16px;

    .creamCard {
      padding: 24px;
    }

    &_title {
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 20px;
      color: $mainBrownColor;
    }

    &_input {
      width: 100%;
      padding-bottom: 8px;
    }

    &_actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr;
      gap: 10px;
    }

    &_terms {
      margin-top: -18px;
      padding-bottom: 8px;
    }

    .hubBtn {
      padding: 12px;
      font-size: 16px;
    }
  }
</style>
