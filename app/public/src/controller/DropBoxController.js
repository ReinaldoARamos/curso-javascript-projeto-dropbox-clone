class DropBoxController {

    constructor(){
        this.inputFilesEl = document.querySelector('#files') //seletor de arquivos
        this.btnSendFileEl = document.querySelector('#btn-send-file') //botao de enviar arquivos
        this.snackModalEl = document.querySelector('#react-snackbar-root') //barra de progresso
        this.progressBarEl = document.querySelector('.mc-progress-bar-fg'); //elemento da barra 
        this.nameFileEl = document.querySelector('.filename'); //classe com o nome do arquivo
        this.timeLeftEl = document.querySelector('.timeleft'); //classe do tempo
        this.InitEvents();
    }
    InitEvents(){
        this.btnSendFileEl.addEventListener('click', e=>{
            this.inputFilesEl.click();

        });
        this.inputFilesEl.addEventListener('change', e=>{
            console.log(e.target.files);
            this.uploadTask(e.target.files) //vai fazer upload de varios arquivos
            this.ModalShow();
            this.inputFilesEl.value = '';
           
        })
    }
    ModalShow(show = true){
        this.snackModalEl.style.display = (show) ? 'block' : 'none'
    }
    uploadTask(files){
        let promises = []; //usamos uma promise pois cada arquivo pode ocorrer o upload ou falhar
        [...files].forEach(files=>{ //criamos um spread para 
            promises.push(new Promise((resolve, reject)=>{ //pega o array vazio e da push nas promises
                let ajax = new XMLHttpRequest(); //aqui criamos um XML request que vai ser enviado como ajax(JOSn)
                ajax.open('POST', '/upload') //Abrimos a conexãop ajax e passamos a rota upload e o método post
                ajax.onload = event => { //assim que o ajax é carregado ele executa o try catch
                    try {
                        resolve(JSON.parse(ajax.responseText)) //o resolve da promise é o texto do ajax(JSOn)
                        this.ModalShow(false)
                    } catch (e) {
                        reject(e); //erro
                        this.ModalShow(false)
                    }
                };
                ajax.onerror = event => {
                    reject(event) //Retorna o erro
                }

                ajax.upload.onprogress = event =>{
                    console.log(event);
                    this.uploadProgress(event, files);
                };
                let formData = new FormData(); //criamos um form data
                formData.append('input-file', files )   //recebe os files(array recebendo as promises)
                this.startUploadTime = Date.now();
                ajax.send(formData); //O form data salva o arquivo recebido  pelo ajax e envia

            }));
        }); //convertemos em array e usamos o spread 
        return Promise.all(promises) //redebe todas as promises e faz o controle doque deu resolve ou reject
    }
    uploadProgress(event, files){
        let timespent = Date.now() - this.startUploadTime;
        let loaded = event.loaded;
        let total = event.total;

        let porcentage = parseInt((loaded/total) * 100) //pega a quantidade total de bytes, divide pela quantidade ja no upload e faz tudo x100
        let timeLeft = ((100 - porcentage) * timespent) / porcentage; //calcula o tempo que falta

        this.progressBarEl.style.width = `${porcentage}%`//Pega a barra e troca dependendo da porcentagem            /*porcentage+'px';*/
       
        this.nameFileEl.innerHTML = files.name; //inseri o nome do arquivo dentro do HTML
        this.timeLeftEl.innerHTML = this.formatTimeToHuman(timeLeft) //inseri quanto tempo falta dentro do html

        console.log(timespent, timeLeft, porcentage)
    }
    formatTimeToHuman(duration)
    {
    let seconds = parseInt((duration / 1000 ) /*converte pra segundos*/ % 60) //pega o resto da divisao no caso os minutos
    let minutes = parseInt((duration / (1000*60)) %60)
    let hours = parseInt((duration / (1000*60 * 60)) %24)
    
    if(hours>0){
        return `${hours} horas  ${minutes} minutos e ${seconds} segundos`
    }

    if(minutes>0){
        return `${minutes} minutos e ${seconds} segundos`
    }

    if(seconds>0){
        return `${seconds} segundos`
    }
    console.log(duration)    
    return '';
    
};

getFileIconview(){


}
getFileView(file){
    return `
    <li>
   ${this.getFileIconview(file)} //pega o icone pois ele varia
</li>` 

}
}   

