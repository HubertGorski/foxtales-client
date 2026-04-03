<script setup lang="ts">
  import { computed, onMounted, ref, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { ROUTE_PATH } from '@/router/routeEnums';
  import { userService } from '@/api/services/UserService';
  import { useField, useForm } from 'vee-validate';
  import { useI18n } from 'vue-i18n';
  import HubBtn from '@/components/hubComponents/HubBtn.vue';
  import HubTooltip from '@/components/hubComponents/HubTooltip.vue';
  import HubCheckbox from '@/components/hubComponents/HubCheckbox.vue';
  import HubInput from '@/components/hubComponents/HubInput.vue';
  import Terms from '@/components/Terms.vue';
  import { useLoading } from '@/composables/useLoading';
  import { useViewStore } from '@/stores/viewStore';
  import { useUserStore } from '@/stores/userStore';

  type FormFields = 'email' | 'username' | 'password' | 'confirmpassword' | 'termsaccepted';

  const { t } = useI18n();
  const router = useRouter();
  const route = useRoute();

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
  const { value: email, errorMessage: emailError } = useField<string>('email');
  const { value: confirmpassword, errorMessage: confirmpasswordError } =
    useField<string>('confirmpassword');
  const { value: password, errorMessage: passwordError } = useField<string>('password');
  const { value: username, errorMessage: usernameError } = useField<string>('username');
  const { value: termsAccepted, errorMessage: termsAcceptedError } =
    useField<boolean>('termsaccepted');

  const { loading: isLoading, withLoading } = useLoading();
  const onSubmit = handleSubmit(async values => {
    await withLoading(async () => {
      try {
        await userService.register(
          values.email,
          values.username,
          values.password,
          values.confirmpassword,
          values.termsaccepted
        );
        await userService.login(values.email, values.password, true);
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
  });

  const navigateBack = () => {
    if (step.value === 2) {
      step.value = 1;
      return;
    }
    router.push(ROUTE_PATH.HOME);
  };

  const navigateToLogin = () => {
    router.push(ROUTE_PATH.LOGIN);
  };

  const isKeyboardOpen = computed(() => {
    return useViewStore().getIsKeyboardOpen();
  });

  const handleEnter = async () => {
    if (step.value === 2 || step.value === 0) {
      if (isCreateBtnDisabled.value) {
        return;
      }

      onSubmit();
      return;
    }

    step.value = 2;
  };

  const areErrorExistInPart1 = computed(() => {
    return !!(usernameError.value || emailError.value);
  });

  const areErrorExistInPart2 = computed(() => {
    return !!(passwordError.value || confirmpasswordError.value);
  });

  const areErrorExist = computed(() => {
    return !!(areErrorExistInPart1.value || termsAcceptedError.value || areErrorExistInPart2.value);
  });

  const isCreateBtnDisabled = computed(
    () => !password.value || !confirmpassword.value || areErrorExist.value
  );

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

  onMounted(() => {
    const { redirectPath: queryRedirectPath } = route.query;
    const { redirectPath, setRedirectPath } = useViewStore();

    if (queryRedirectPath) {
      setRedirectPath(queryRedirectPath as string);

      const query = { ...route.query };
      delete query.redirectPath;
      router.replace({ query });
    }

    if (useUserStore().user.accessToken) {
      router.push((queryRedirectPath as string) || redirectPath || ROUTE_PATH.MENU);
      setRedirectPath(null);
    }
  });
</script>

<template>
  <div class="registerView" :class="{ isFocused: isKeyboardOpen }">
    <img src="@/assets/imgs/4.webp" alt="Lisek" class="registerView_fox" />
    <form class="creamCard" @submit.prevent="onSubmit">
      <h1 class="registerView_title">{{ $t('registerTitle') }}</h1>
      <div v-if="step === 1 || step === 0">
        <HubInput
          v-model="username"
          :label="$t('auth.username')"
          class="registerView_input"
          :errorMessages="usernameError"
          @focus="step = 1"
          @enter="handleEnter"
        />
        <HubInput
          v-model="email"
          :label="$t('auth.email')"
          class="registerView_input"
          :errorMessages="emailError"
          @focus="step = 1"
          @enter="handleEnter"
        />
      </div>
      <div v-show="step === 2 || step === 0">
        <HubInput
          v-model="password"
          :label="$t('auth.password')"
          textType="password"
          class="registerView_input"
          :errorMessages="passwordError"
          @focus="step = 2"
          @enter="handleEnter"
        />
        <HubInput
          v-model="confirmpassword"
          :label="$t('auth.repeatPassword')"
          textType="password"
          class="registerView_input"
          :errorMessages="confirmpasswordError"
          @focus="step = 2"
          @enter="handleEnter"
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
        <HubBtn text="back2" :action="navigateBack" />
        <HubTooltip
          v-if="step === 1"
          tooltipText="auth.fillFormCorrectly"
          :tooltipDisabled="!(!username || !email || areErrorExistInPart1)"
        >
          <HubBtn
            text="next"
            :action="() => (step = 2)"
            :disabled="!username || !email || areErrorExistInPart1"
            isOrange
          />
        </HubTooltip>
        <HubTooltip
          v-if="step === 2 || step === 0"
          tooltipText="auth.fillFormCorrectly"
          :tooltipDisabled="isTooltipDisabled"
        >
          <HubBtn
            text="create"
            :action="onSubmit"
            :disabled="isCreateBtnDisabled || isLoading"
            :loading="isLoading"
            isOrange
          />
        </HubTooltip>
      </div>

      <div class="registerView_footer">
        <p class="registerView_footerText">
          {{ $t('auth.alreadyHaveAccount') }}
          <span class="registerView_footerLink" @click="navigateToLogin">
            {{ $t('login') }}
          </span>
        </p>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
  @use '@/assets/styles/variables' as *;

  .registerView {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    min-height: 100%;
    background: $mainBackground;
    padding: 24px 16px;
    overflow: visible;

    &.isFocused {
      .registerView_fox {
        transition: all 0.4s ease-in-out;
        height: 0;
        top: -4px;
      }
    }

    .creamCard {
      padding: 32px 32px 12px;
      border-radius: 20px;
      width: 100%;
      max-width: 440px;
      backdrop-filter: blur(12px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
    }

    &_fox {
      position: relative;
      top: 8px;
      height: 180px;
      z-index: 1;
    }

    &_title {
      font-size: 26px;
      font-weight: 800;
      text-align: center;
      margin-bottom: 20px;
      color: $mainBrownColor;
      letter-spacing: -0.5px;
    }

    &_input {
      width: 100%;
      padding-bottom: 4px;
    }

    &_actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 12px;
    }

    &_terms {
      padding: 8px 0;
    }

    &_footer {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid rgba($mainBrownColor, 0.08);
      display: flex;
      justify-content: center;
      width: 100%;
    }

    &_footerText {
      font-size: 15px;
      color: rgba($mainBrownColor, 0.7);
      font-weight: 500;
      letter-spacing: -0.2px;
      display: flex;
      align-items: center;
    }

    &_footerLink {
      color: $mainOrangeColor;
      font-weight: 800;
      cursor: pointer;
      margin-left: 8px;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      display: inline-block;
      position: relative;
      padding: 2px 4px;

      &::after {
        content: '';
        position: absolute;
        bottom: 0px;
        left: 0;
        width: 100%;
        height: 2px;
        background: $mainOrangeColor;
        transform: scaleX(0);
        transform-origin: right;
        transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        border-radius: 2px;
      }

      &:active {
        transform: scale(0.95);
      }
    }
  }
</style>
