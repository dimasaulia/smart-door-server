const submit = document.querySelector("#submit");
const form = document.querySelector("form");
submit.addEventListener("click", async (e) => {
    e.preventDefault();
    document.querySelector("#username--error").textContent = "";
    document.querySelector("#password--error").textContent = "";
    const username = form.username.value;
    const password = form.password.value;
    console.log(username, password);
    await fetch("/api/v1/user/login", {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
            username: username,
            password: password,
        }),
    })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            if (!data.success) throw data;
            setToast({
                status: "success",
                title: "Berhasil Login",
                msg: "Berhasil mengauntentikasi user",
            });
            return (window.location = "/dashboard");
        })
        .catch((err) => {
            if (err.data.errors.type)
                document.querySelector(
                    `#${err.data.errors.type}--error`
                ).textContent = err.data.errors.msg;

            const formChecker = err.data.errors;
            if (formChecker) {
                formChecker.forEach((data) => {
                    document.querySelector(
                        `#${data.param}--error`
                    ).textContent = data.msg;
                });
            }
        });
});
