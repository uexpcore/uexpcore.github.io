// ===============================
// Contact Form - Web3Forms
// ===============================

const form = document.getElementById("contact-form");
const submitBtn = document.getElementById("submit-btn");

const btnText = submitBtn.querySelector(".btn-text");
const btnLoading = submitBtn.querySelector(".btn-loading");

const successMessage = document.getElementById("form-success");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Hide previous success message
    successMessage.style.display = "none";

    // Create FormData
    const formData = new FormData(form);

    // Web3Forms Access Key
    formData.append("access_key", "85b825b9-2fe0-49ee-8521-f368588a1168");

    // Optional
    formData.append("from_name", "Portfolio Contact Form");
    formData.append("subject", form.subject.value);

    // Button Loading State
    btnText.style.display = "none";
    btnLoading.style.display = "inline-flex";
    submitBtn.disabled = true;

    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        if (response.ok && result.success) {

            successMessage.style.display = "flex";

            form.reset();

            // Hide success after 5 seconds
            setTimeout(() => {
                successMessage.style.display = "none";
            }, 5000);

        } else {
            alert(result.message || "Failed to send message.");
        }

    } catch (error) {
        console.error(error);
        alert("Something went wrong. Please try again later.");
    } finally {

        btnText.style.display = "inline-flex";
        btnLoading.style.display = "none";
        submitBtn.disabled = false;

    }
});
