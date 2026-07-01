document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("contact-form");
    if (!form) return;

    const submitBtn = document.getElementById("submit-btn");
    const btnText = submitBtn.querySelector(".btn-text");
    const btnLoading = submitBtn.querySelector(".btn-loading");
    const successMessage = document.getElementById("form-success");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        successMessage.style.display = "none";

        const formData = new FormData(form);
        formData.append("access_key", "85b825b9-2fe0-49ee-8521-f368588a1168");

        btnText.style.display = "none";
        btnLoading.style.display = "inline-flex";
        submitBtn.disabled = true;

        try {
            const res = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const data = await res.json();

            if (data.success) {
                form.reset();
                successMessage.style.display = "flex";

                setTimeout(() => {
                    successMessage.style.display = "none";
                }, 5000);
            } else {
                alert(data.message || "Failed");
            }

        } catch (err) {
            console.error(err);
            alert("Network error");
        }

        btnText.style.display = "inline-flex";
        btnLoading.style.display = "none";
        submitBtn.disabled = false;
    });

});
