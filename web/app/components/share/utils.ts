export const checkOrSetAccessToken = async () => {
  const accessToken = localStorage.getItem('token')
  if (!accessToken)
    window.location.href = '/chat/login'
}
