export const getIconName = (codeOrCategory, iconMapping) => {
    let defaultIconName = 'help' // Default icon if not found

    for (const [icon, identifiers] of Object.entries(iconMapping)) {
        if (identifiers.includes(codeOrCategory)) {
            return icon
        }
    }

    return defaultIconName
}