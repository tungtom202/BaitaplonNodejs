var myIndex = 0;
carousel();

function carousel() {
  var i;
  var x = document.getElementsByClassName("mySlides");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";  
  }
  myIndex++;
  if (myIndex > x.length) {myIndex = 1}    
  x[myIndex-1].style.display = "block";  
  setTimeout(carousel, 10000);    
}


// ngày giờ trực tiếp 
window.addEventListener('DOMContentLoaded', (event) => {
  var currentDate = new Date();
  var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  var dayOfWeek = daysOfWeek[currentDate.getDay()];
  var month = monthsOfYear[currentDate.getMonth()];
  var dayOfMonth = currentDate.getDate();
  var year = currentDate.getFullYear();

  var formattedDate = dayOfWeek + ', ' + month + ' ' + dayOfMonth + ' ' + year;

  document.getElementById('currentDate').textContent = formattedDate;
});