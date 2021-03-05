class CurrentUserHelper {
  canPerform = (user, ...roles) => {
    let permission = user
    if(roles.length > 0 ) permission &&= roles.includes(user.role)
    return (permission);
  }
}
export default new CurrentUserHelper();