<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ROUTE_PATH } from '@/router/routeEnums';

const router = useRouter();

const form = ref({
  username: '',
  password: '',
  confirmPassword: '',
});

const submitForm = () => {
  console.log('Form submitted:', form.value);
  router.push(ROUTE_PATH.LOGIN);
};

const navigateBack = () => {
  router.push(ROUTE_PATH.HOME);
};
</script>

<template>
  <div class="registerView">
    <form @submit.prevent="submitForm" class="whiteCard">
      <h1 class="registerView_title">{{ $t("registerTitle") }}</h1>
      <v-text-field
        v-model="form.username"
        label="Nazwa użytkownika"
        outlined
        dense
        class="registerView_input"
        required
      />
      <v-text-field
        v-model="form.password"
        label="Hasło"
        type="password"
        outlined
        dense
        class="registerView_input"
        required
      />
      <v-text-field
        v-model="form.confirmPassword"
        label="Powtórz hasło"
        type="password"
        outlined
        dense
        class="registerView_input"
        required
      />
      <div class="registerView_actions">
        <button type="button" @click="navigateBack" class="registerView_btn registerView_btn--back">
          {{ $t("back2") }}
        </button>
        <button type="submit" class="registerView_btn registerView_btn--submit">
          {{ $t("create") }}
        </button>
      </div>
    </form>
    <img src="@/assets/imgs/fox10.png" alt="Lisek" class="registerView_fox" />
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.registerView {
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  background: $mainBackground;
  padding: 120px 16px;

  &_fox {
    position: relative;
    bottom: -52px;
    left: -32px;
    transform: scale(1.2);
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
