<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { ROUTE_PATH } from "@/router/routeEnums";
import { userService } from "@/api/services/UserService";
import * as yup from "yup";
import { useField, useForm } from "vee-validate";
import { useI18n } from "vue-i18n";
import { delay } from "lodash";
import HubBtn from "@/components/hubComponents/HubBtn.vue";

const { t } = useI18n();
const router = useRouter();

const step = ref(0);
const errorLogin = ref("");

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
      errorLogin.value = data?.title
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

const areErrorExist = computed(() => {
  return !!(
    usernameError.value ||
    emailError.value ||
    passwordError.value ||
    confirmpasswordError.value ||
    errorLogin.value
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
          outlined
          dense
          class="registerView_input"
          :error-messages="usernameError"
          @focus="step = 1"
        />
        <v-text-field
          v-model="email"
          :label="$t('auth.email')"
          outlined
          dense
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
          outlined
          dense
          class="registerView_input"
          :error-messages="passwordError"
          @focus="step = 2"
        />
        <v-text-field
          v-model="confirmpassword"
          :label="$t('auth.repeatPassword')"
          type="password"
          outlined
          dense
          class="registerView_input"
          :error-messages="confirmpasswordError"
          @focus="step = 2"
        />
      </div>
      <div class="registerView_actions">
        <button
          type="button"
          @click="navigateBack"
          class="registerView_btn registerView_btn--back"
        >
          {{ $t("back2") }}
        </button>
        <HubBtn
          v-if="step === 1"
          :text="$t('next')"
          :action="() => (step = 2)"
          class="registerView_btn registerView_btn--submit"
          :disabled="!username || !email || areErrorExist"
        >
        </HubBtn>
        <button
          v-if="step === 2 || step === 0"
          @click="delay(() => (areErrorExist ? (step = 0) : null), 500)"
          type="submit"
          class="registerView_btn registerView_btn--submit"
        >
          {{ $t("create") }}
        </button>
      </div>
      <div class="error">
        {{ errorLogin }}
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

  &_btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 12px 20px;
    font-size: 16px;
    font-weight: bold;
    text-transform: uppercase;
    border-radius: 8px;
    cursor: pointer;
    border: none;
    color: white;

    &--back {
      background-color: $mainBrownColor;
    }

    &--submit {
      background-color: $mainOrangeColor;
    }
  }
}
</style>
