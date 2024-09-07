// Toggle the card details display
document.getElementById('cardHeading').addEventListener('click', function() {
    var cardDetails = document.getElementById('cardDetails');
    cardDetails.classList.toggle('show');
});

document.getElementById('upiHeading').addEventListener('click', function() {
    var upiDetails = document.getElementById('upiDetails');
    upiDetails.classList.toggle('show');
});

document.getElementById('onlineHeading').addEventListener('click', function() {
    var onlineDetails = document.getElementById('onlineDetails');
    onlineDetails.classList.toggle('show');
});

document.querySelectorAll('.payment-option').forEach(button => {
button.addEventListener('click', function() {
    document.querySelectorAll('.payment-option').forEach(btn => btn.classList.remove('selected'));
    this.classList.add('selected');
});
});

document.getElementById('proceedButton').addEventListener('click', function() {
    const selectedOption = document.querySelector('.payment-option.selected');
    if (selectedOption) {
        alert(`Proceeding with ${selectedOption.textContent.trim()}`);
        // Add further payment processing logic here
    } else {
        alert('Please select a payment method');
    }
});