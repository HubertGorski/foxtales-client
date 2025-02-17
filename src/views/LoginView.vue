<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ROUTE_PATH } from "@/router/routeEnums";

const router = useRouter();

const form = ref({
  username: "",
  password: "",
});

const submitForm = () => {
  console.log("Form submitted:", form.value);
  router.push(ROUTE_PATH.MENU);
};

const navigateBack = () => {
  router.push(ROUTE_PATH.HOME);
};
</script>

<template>
  <div class="loginView">
    <img src="@/assets/imgs/4.png" alt="Lisek" class="loginView_fox" />
    <form @submit.prevent="submitForm" class="creamCard">
      <h1 class="loginView_title">Logowanie</h1>
      <v-text-field
        v-model="form.username"
        label="Nazwa użytkownika"
        outlined
        dense
        class="loginView_input"
        required
      />
      <v-text-field
        v-model="form.password"
        label="Hasło"
        type="password"
        outlined
        dense
        class="loginView_input"
        required
      />
      <div class="loginView_actions">
        <button
          type="button"
          @click="navigateBack"
          class="loginView_btn loginView_btn--back"
        >
          Wstecz
        </button>
        <button type="submit" class="loginView_btn loginView_btn--submit">
          Zaloguj
        </button>
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
