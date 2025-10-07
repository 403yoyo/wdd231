// Small modal utility
export function openModal(title, content){
  const modal = document.createElement('div');
  modal.className = 'lh-modal';
  modal.innerHTML = `<div class="lh-modal-inner"><h3>${title}</h3><div>${content}</div><button class="lh-close">Close</button></div>`;
  document.body.appendChild(modal);
  modal.querySelector('.lh-close').addEventListener('click', () => modal.remove());
}

export function closeModal(){
  document.querySelectorAll('.lh-modal').forEach(m => m.remove());
}