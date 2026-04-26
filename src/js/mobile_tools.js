function addfullscreenListener() {

    const canvas = document.getElementById("canvas");
    const btn = document.getElementById("fullscreen-btn");

    btn.addEventListener("click", () => {
        
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen();
        } else if (canvas.webkitRequestFullscreen) { // Safari
            canvas.webkitRequestFullscreen();
        }
    });

}

export default function setupMobile(){

    addfullscreenListener();
}