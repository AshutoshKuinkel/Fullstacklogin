const signupFunc = async(e)=>{
  e.preventDefault()

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const name = document.getElementById('name').value.trim();

  let displayMessage = document.getElementById('display-text')

   try{
    const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email, password,phone,name}),
    })
    const data = await res.json()

    if(res.ok){
      //here we are redirecting the user to our dashboard page if the login details are correct
      localStorage.setItem('user', JSON.stringify(data.data)); //This saves the logged-in user’s data into the browser so that the dashboard can later read it and show their name.
      window.location.href = '/dashboard.html'
    } else {
      displayMessage.style.color = 'red';
      displayMessage.textContent = data.message || 'Registration failed, try again.';
    }
  }catch(err){
    displayMessage.style.color = 'red'
    displayMessage.textContent = data.message || `Network error, please try again`
  }
}