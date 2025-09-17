// Firebase Initialization
const firebaseConfig = {
  apiKey: "AIzaSyDh7K8pu45Zt6gxEwIJU7m--KLgggGLc6U",
  authDomain: "ariella-bed4a.firebaseapp.com",
  projectId: "ariella-bed4a",
  storageBucket: "ariella-bed4a.firebasestorage.app",
  messagingSenderId: "73358142755",
  appId: "1:73358142755:web:237856e7eb0f13be88b096"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Password protection
const PASSWORD = "ariella123"; // change to your desired password
const passwordPage = document.getElementById('password-page');
const notebookPage = document.getElementById('notebook-page');
const passwordInput = document.getElementById('password-input');
const passwordBtn = document.getElementById('password-btn');
const passwordError = document.getElementById('password-error');

passwordBtn.addEventListener('click', () => {
  if(passwordInput.value === PASSWORD){
    passwordPage.style.display = 'none';
    notebookPage.classList.remove('hidden');
    loadPages();
  } else {
    passwordError.style.display = 'block';
  }
});

// Notebook logic
let currentPage = 0;
let pagesData = [];

const pageWrapper = document.getElementById('page-wrapper');
const pageNumberDisplay = document.getElementById('page-number');
const prevBtn = document.getElementById('prev-page');
const nextBtn = document.getElementById('next-page');
const printBtn = document.getElementById('print-btn');

function createPageElement(pageObj, index){
  const pageDiv = document.createElement('div');
  pageDiv.className = 'page';

  const title = document.createElement('h2');
  title.textContent = pageObj.title || `Page ${index+1}`;
  pageDiv.appendChild(title);

  const textarea = document.createElement('textarea');
  textarea.value = pageObj.text || '';
  textarea.addEventListener('input', (e)=>{
    pagesData[index].text = e.target.value;
    savePage(index);
  });
  pageDiv.appendChild(textarea);

  const img = document.createElement('div');
  img.className = 'image-placeholder';
  img.textContent = 'Image';
  pageDiv.appendChild(img);

  const qr = document.createElement('div');
  qr.className = 'qr-placeholder';
  qr.textContent = 'QR Code';
  pageDiv.appendChild(qr);

  return pageDiv;
}

function renderPage(index){
  pageWrapper.innerHTML = '';
  const pageEl = createPageElement(pagesData[index], index);
  pageWrapper.appendChild(pageEl);
  pageNumberDisplay.textContent = index+1;
}

// Firebase Load Pages
async function loadPages(){
  const snapshot = await db.collection('pages').orderBy('pageNumber').get();
  if(snapshot.empty){
    // create first page if none exists
    pagesData.push({title:'Page 1', text:'', pageNumber:1});
    savePage(0);
    renderPage(0);
  } else {
    snapshot.forEach(doc => {
      pagesData.push(doc.data());
    });
    renderPage(currentPage);
  }
}

// Save page to Firebase
function savePage(index){
  const pageObj = pagesData[index];
  db.collection('pages').doc(`page${index+1}`).set({
    title: pageObj.title || `Page ${index+1}`,
    text: pageObj.text || '',
    pageNumber: index+1
  });
}

// Navigation
prevBtn.addEventListener('click', ()=>{
  if(currentPage > 0){
    currentPage--;
    renderPage(currentPage);
  }
});

nextBtn.addEventListener('click', ()=>{
  currentPage++;
  if(currentPage >= pagesData.length){
    // create new blank page
    pagesData.push({title:`Page ${pagesData.length+1}`, text:'', pageNumber: pagesData.length+1});
    savePage(currentPage);
  }
  renderPage(currentPage);
});

// Print
printBtn.addEventListener('click', ()=>{
  window.print();
});
