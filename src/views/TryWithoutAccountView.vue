<script setup lang="ts">
import { useRouter } from "vue-router";
import { ROUTE_PATH } from "@/router/routeEnums";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import WhiteCard from "@/components/WhiteCard.vue";
import HubInputBox from "@/components/hubComponents/HubInputBox.vue";
import NavigationBtns from "@/components/NavigationBtns.vue";
import { useField, useForm } from "vee-validate";
import * as yup from "yup";
import { userService } from "@/api/services/UserService";

const { t } = useI18n();
const router = useRouter();
const error = ref("");

const schema = yup.object({
  username: yup.string().required(t("auth.usernameCannotBeEmpty")),
});
const { handleSubmit, setFieldError } = useForm({ validationSchema: schema });
const { value: username, errorMessage: usernameError } = useField<string>("username")

const onSubmit = handleSubmit(async (values) => {
  try {
    await userService.registerTmpUser(values.username);
    router.push(ROUTE_PATH.MENU);
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
      error.value = data?.title
        ? t(`auth.${data.title}`)
        : t("auth.unexpectedError");
    }
  }
});

const back = () => {
  router.push(ROUTE_PATH.HOME);
};
</script>

<template>
  <div class="tryWithoutAccountView">
    <WhiteCard :header="t('attention')">
      <p class="alert">{{ t("tryWithoutAccountView.alert") }}</p>
    </WhiteCard>
    <HubInputBox
      v-model="username"
      :error-messages="usernameError"
      title="auth.username"
      btnText="tryWithoutAccount"
      :btnAction="onSubmit"
      withFoxImg
    />
    <NavigationBtns
      class="navBtns"
      btn="back"
      btn2="register"
      :btnCustomAction="back"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables";

.tryWithoutAccountView {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 36px;
  height: 100vh;
  background: $mainBackground;
  padding: 24px;
  padding-bottom: 92px;

  .alert {
    font-size: 14px;
    font-style: italic;
    color: $lightGrayColor;
    letter-spacing: 0.5px;
  }

  .navBtns {
    position: fixed;
    padding: 8px;
    bottom: 0;
  }
}
</style>
