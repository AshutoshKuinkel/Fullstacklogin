const forgotPassFunc = async(e)=>{
  e.preventDefault()

  const email = document.getElementById('email').value.trim();

  let displayMessage = document.getElementById('display-text')

   try{
    const res = await fetch('/api/auth/forgotPassword', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email}),
    })
    const data = await res.json()

    if(res.ok){
      displayMessage.style.color = 'green'
      displayMessage.textContent = 'Email link sent, please check email'
    } else {
      displayMessage.style.color = 'red';
      displayMessage.textContent = data.message || 'Link was not sent, try again';
    }
  }catch(err){
    displayMessage.style.color = 'red'
    displayMessage.textContent = data.message || `Network error, please try again`
  }
}