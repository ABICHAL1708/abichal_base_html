let closed = true;

function openNav() {
    if(closed==true){
        closed = false;
        document.getElementById("mySidebar").style.width = "15%";
        document.getElementById("myMain").style.marginLeft = "15%";
    }
    else{
        closed = true;
        document.getElementById("mySidebar").style.width = "3%";
        document.getElementById("myMain").style.marginLeft = "3%";
    }
}