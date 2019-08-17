export const LOGIN = (data) => {
    return {
        type: 'LOGIN',
        data : data
    };
}
export const REGISTER = (status) => {
    return{
        type: 'REGISTER',
        status: status
    };
}