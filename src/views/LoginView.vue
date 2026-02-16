<script setup lang="ts">
  import { useRouter } from 'vue-router';
  import { ROUTE_PATH } from '@/router/routeEnums';
  import { useForm, useField } from 'vee-validate';
  import * as yup from 'yup';
  import { computed } from 'vue';
  import { userService } from '@/api/services/UserService';
  import { useI18n } from 'vue-i18n';
  import { SESSION_STORAGE } from '@/enums/sessionStorageEnum';
  import { useViewStore } from '@/stores/viewStore';

  const { t } = useI18n();
  const router = useRouter();

  const schema = yup.object({
    email: yup.string().required(t('auth.emailIsRequired')).email(t('auth.emailFormatIsIncorrect')),
    password: yup.string().required(t('auth.passwordIsRequired')),
  });

  const { handleSubmit } = useForm({ validationSchema: schema });
  const { value: email, errorMessage: emailError } = useField('email');
  const { value: password, errorMessage: passwordError } = useField('password');

  const navigateBack = () => {
    router.push(ROUTE_PATH.HOME);
  };

  const onSubmit = handleSubmit(async values => {
    await userService.login(values.email, values.password);
    try {
      const redirectUrl = sessionStorage.getItem(SESSION_STORAGE.REDIRECT_AFTER_LOGIN);
      if (redirectUrl) {
        sessionStorage.removeItem(SESSION_STORAGE.REDIRECT_AFTER_LOGIN);
        router.push(redirectUrl);
      } else {
        router.push(ROUTE_PATH.MENU);
      }
    } catch {
      router.push(ROUTE_PATH.MENU);
    }
  });

  const isKeyboardOpen = computed(() => {
    return useViewStore().getIsKeyboardOpen();
  });
</script>

<template>
  <div class="loginView" :class="{ isFocused: isKeyboardOpen }">
    <img src="@/assets/imgs/4.webp" alt="Lisek" class="loginView_fox" />
    <form class="creamCard" @submit.prevent="onSubmit">
      <h1 class="loginView_title">{{ $t('auth.loginTitle') }}</h1>
      <v-text-field
        v-model="email"
        :label="$t('auth.email')"
        outlined
        dense
        class="loginView_input"
        :error-messages="emailError"
      />
      <v-text-field
        v-model="password"
        :label="$t('auth.password')"
        type="password"
        outlined
        dense
        class="loginView_input"
        :error-messages="passwordError"
      />
      <div class="loginView_actions">
        <button type="button" class="loginView_btn loginView_btn--back" @click="navigateBack">
          {{ $t('back2') }}
        </button>
        <button type="submit" class="loginView_btn loginView_btn--submit">
          {{ $t('auth.logIn') }}
        </button>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
  @use '@/assets/styles/variables' as *;

  .loginView {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    background: $mainBackground;
    padding: 0 16px;

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
