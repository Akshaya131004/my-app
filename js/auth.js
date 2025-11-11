const poolData = {
    UserPoolId: 'ap-south-1_Dm338c296', // Replace with your Cognito User Pool ID
    ClientId: '33a9f0ko94pomgp2vutatqnkrp'   // Replace with your App Client ID
};
 
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
 
// ---------------- SIGN UP ----------------
function registerUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
 
    const attributeList = [
        new AmazonCognitoIdentity.CognitoUserAttribute({ Name: 'email', Value: email })
    ];
 
    userPool.signUp(username, password, attributeList, null, (err, result) => {
        if (err) {
            alert(err.message || JSON.stringify(err));
            if (err.code === 'UsernameExistsException' {
                window.location.href = 'signin.html';
            }
            return;
        }
        alert('Registration successful! Please login.');
        window.location.href = 'signin.html';
    });
}
 
// ---------------- LOGIN ----------------
function loginUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
 
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: username,
        Password: password
    });
 
    const userData = {
        Username: username,
        Pool: userPool
    };
 
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
 
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
            // Save session token in localStorage
            localStorage.setItem('cognitoToken', result.getAccessToken().getJwtToken());
            alert('Login successful!');
            window.location.href = 'ride.html';
        },
        onFailure: (err) => {
            alert(err.message || JSON.stringify(err));
        }
    });
}
 
// ---------------- CHECK SESSION ----------------
function checkSession() {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
        cognitoUser.getSession((err, session) => {
            if (err || !session.isValid()) {
                console.log('Session invalid, redirecting to login...');
                window.location.href = 'signin.html';
            } else {
                console.log('User is logged in, redirecting to ride page...');
                window.location.href = 'ride.html';
            }
        });
    } else {
        console.log('No user found, redirecting to login...');
        window.location.href = 'signin.html';
    }
}
 
// ---------------- LOGOUT ----------------
function logoutUser() {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
        cognitoUser.signOut();
        localStorage.removeItem('cognitoToken');
        alert('Logged out successfully!');
        window.location.href = 'signin.html';
    }
}
