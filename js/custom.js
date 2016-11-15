var buttonNavToggle = document.getElementById('anchor_navToggle');
var offCanvas = document.getElementById('offCanvas');
    
buttonNavToggle.addEventListener('click', toggleClass);
    
function toggleClass(e) {
        
    e.preventDefault();
        
    this.classList.toggle('active');
    offCanvas.classList.toggle('open');
        
}

$("select").select2({dropdownCssClass: 'dropdown-info'});
$(':checkbox').radiocheck();

$('form').validator().on('submit', function (e) {
    
    $(this).find('button[type="submit"]').addClass('disabled');
    
    if (e.isDefaultPrevented()) {
        // handle the invalid form...
        $(this).find('button[type="submit"]').removeClass('disabled');
    } else {
        // everything looks good!
    }

})