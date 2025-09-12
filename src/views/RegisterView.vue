<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { ROUTE_PATH } from "@/router/routeEnums";
import { userService } from "@/api/services/UserService";
import * as yup from "yup";
import { useField, useForm } from "vee-validate";
import { useI18n } from "vue-i18n";
import HubBtn from "@/components/hubComponents/HubBtn.vue";

const { t } = useI18n();
const router = useRouter();

const step = ref(0);
const errorRegister = ref("");

const schema = yup.object({
  email: yup
    .string()
    .required(t("auth.emailIsRequired"))
    .email(t("auth.emailFormatIsIncorrect")),
  password: yup.string().required(t("auth.passwordIsRequired")),
  confirmpassword: yup.string().required(t("auth.passwordIsRequired")),
  username: yup.string().required(t("auth.usernameCannotBeEmpty")),
});

const { handleSubmit, setFieldError } = useForm({ validationSchema: schema });
const { value: email, errorMessage: emailError } = useField("email");
const { value: confirmpassword, errorMessage: confirmpasswordError } =
  useField("confirmpassword");
const { value: password, errorMessage: passwordError } = useField("password");
const { value: username, errorMessage: usernameError } = useField("username");

const onSubmit = handleSubmit(async (values) => {
  try {
    await userService.register(
      values.email,
      values.username,
      values.password,
      values.confirmpassword
    );
    router.push(ROUTE_PATH.WELCOME);
  } catch (err: any) {
    step.value = 0;
    const data = err?.response?.data;
    if (data?.errors) {
      Object.entries(data.errors).forEach(
        ([field, messages]: [string, any]) => {
          if (Array.isArray(messages)) {
            setFieldError(field.toLowerCase(), t(`auth.${messages[0]}`));
          }
        }
      );
    } else {
      errorRegister.value = data?.title
        ? t(`auth.${data.title}`)
        : t("auth.unexpectedError");
    }
  }
});

const navigateBack = () => {
  if (step.value === 2) {
    step.value = 1;
    return;
  }
  router.push(ROUTE_PATH.HOME);
};

const areErrorExistInPart1 = computed(() => {
  return !!(usernameError.value || emailError.value);
});

const areErrorExistInPart2 = computed(() => {
  return !!(passwordError.value || confirmpasswordError.value);
});

const areErrorExist = computed(() => {
  return !!(
    areErrorExistInPart1.value ||
    areErrorExistInPart2.value ||
    errorRegister.value
  );
});
</script>

<template>
  <div class="registerView" :class="{ isFocused: step }">
    <form @submit.prevent="onSubmit" class="creamCard">
      <h1 class="registerView_title">{{ $t("registerTitle") }}</h1>
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
      <div class="registerView_actions">
        <HubBtn
          :text="$t('back2')"
          :action="navigateBack"
        />
        <HubBtn
          v-if="step === 1"
          :text="$t('next')"
          :action="() => (step = 2)"
          :disabled="!username || !email || areErrorExistInPart1"
          isOrange
        />
        <HubBtn
          v-if="step === 2 || step === 0"
          :text="$t('create')"
          :action="onSubmit"
          :disabled="!password || !confirmpassword || areErrorExist"
          isOrange
        />
      </div>
      <div class="error">
        {{ errorRegister }}
      </div>
    </form>
    <img src="@/assets/imgs/fox10.webp" alt="Lisek" class="registerView_fox" />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables";

.registerView {
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  background: $mainBackground;
  padding: 80px 16px;

  .creamCard {
    padding: 24px;
  }

  &_fox {
    position: relative;
    bottom: 16px;
    left: -32px;
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
    display: flex;
    justify-content: space-between;
    gap: 10px;
  }

  .hubBtn {
    padding: 12px;
    font-size: 16px;
  }

  .error {
    width: 100%;
    text-align: center;
    padding-top: 12px;
    color: $errorColor;
  }

  &.isFocused {
    padding: 8px 16px;
    transition: all 0.4s;

    .registerView_title {
      transition: all 0.4s;
      font-size: 0;
      margin: 0;
    }

    .creamCard {
      padding: 16px;
    }
  }
}
</style>
