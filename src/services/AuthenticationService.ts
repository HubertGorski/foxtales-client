import Api from "@/services/Api";

interface User {
  login: string;
  password: string;
}

export default {
  register(credentials: User) {
    return Api().post("register", credentials);
  },
};
