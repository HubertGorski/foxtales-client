<script setup lang="ts">
import { useRouter } from "vue-router";
import { ROUTE_PATH } from "@/router/routeEnums";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import { ref } from "vue";
import { UserService } from "@/api/services/UserService";
import { useUserStore } from "@/stores/userStore";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const userStore = useUserStore();
const router = useRouter();
const errorLogin = ref("");

const schema = yup.object({
  email: yup
    .string()
    .required(t("auth.emailIsRequired"))
    .email(t("auth.emailFormatIsIncorrect")),
  password: yup.string().required(t("auth.passwordIsRequired")),
});

const { handleSubmit } = useForm({ validationSchema: schema });
const { value: email, errorMessage: emailError } = useField("email");
const { value: password, errorMessage: passwordError } = useField("password");

const navigateBack = () => {
  router.push(ROUTE_PATH.HOME);
};

const onSubmit = handleSubmit(async (values) => {
  try {
    const response = await UserService.login(values.email, values.password);    
    router.push(ROUTE_PATH.MENU);
    userStore.setUsername(response.username);
  } catch (err: any) {
    errorLogin.value = err?.response?.data ? t(`auth.${err.response.data}`) : t("auth.unexpectedError");
  }
});
</script>

<template>
  <div class="loginView">
    <img
      src="@/assets/imgs/4.png"
      alt="Lisek"
      class="loginView_fox"
    />
    <form @submit.prevent="onSubmit" class="creamCard">
      <h1 class="loginView_title">{{ $t("auth.loginTitle") }}</h1>
      <v-text-field
        v-model="email"
        label="Email"
        outlined
        dense
        class="loginView_input"
        :error-messages="emailError"
      />
      <v-text-field
        v-model="password"
        label="Hasło"
        type="password"
        outlined
        dense
        class="loginView_input"
        :error-messages="passwordError"
      />
      <div class="loginView_actions">
        <button
          type="button"
          @click="navigateBack"
          class="loginView_btn loginView_btn--back"
        >
          {{ $t("back2") }}
        </button>
        <button type="submit" class="loginView_btn loginView_btn--submit">
          {{ $t("auth.logIn") }}
        </button>
      </div>
      <div class="error">
        {{ errorLogin }}
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables";

.loginView {
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  background: $mainBackground;
  padding: 0 16px;

  .error {
    width: 100%;
    text-align: center;
    padding-top: 12px;
    color: $errorColor;
  }

  .creamCard {
    padding: 24px;
  }

  &_fox {
    position: relative;
    top: 8px;
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
    padding: 8px 0;
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
