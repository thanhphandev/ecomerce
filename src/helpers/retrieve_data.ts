type User = {
    username: string,
    email: string,
    phone: number
}
export const retrieveData = (user: User) => {
    return {
        username: user.username,
        email: user.email,
        phone: user.phone,
    }

}