export function handleChange(name, value, setData) {
    setData((prevState) => ({
        ...prevState,
        [name]: value,
    }))
}
