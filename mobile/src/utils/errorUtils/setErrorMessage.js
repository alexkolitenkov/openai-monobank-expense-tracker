export const setErrorMessage = (inputName, message, setErrors) => {
    setErrors((prevError) => ({
        ...prevError,
        [inputName]: message,
    }))
}