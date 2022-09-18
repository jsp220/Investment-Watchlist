/*
    Created:    09/17/2022 
    Programmer: Brian Zoulko
    Notes:      Created this module to call the index.html so our application
                has animation in Project#1 - Investment-Watchlist.

    Modification
    ============
    09/17/2022 Brian Zoulko    Created splash screen.
*/
var list = ["By","Ryan Dao","Joon Park","Qi Chen","and","Brian Zoulko"];

async function startAnimation() {
    
    await pause(3000);

    for (let x = 0; x < list.length; x++) {
        // 1 second delay
        $('.list-it').fadeIn("slow");
        await pause(300);
        $('.list-it').text(list[x]);
        await pause((x==0 ? 1200: 800));
        $('.list-it').fadeOut("slow");
        await pause(300);
    }
   
    await pause(3000).then(() => window.open('index.html', '_self'));
    return;

}

function pause(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

startAnimation();