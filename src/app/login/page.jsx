import styles from "@/styles/login/login.module.css";

const Login = () => {
return (
    <div className={styles.container}>
      <div className={styles["login-box"]}>
        <h1>Login</h1>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button>Sign In</button>
      </div>
    </div>
  );
};

export default Login;
