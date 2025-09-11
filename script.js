// Minimal cart logic (localStorage)
const $ = (s,r=document)=>r.querySelector(s);
const CART_KEY='aqeelah_cart_v1'; const fmt=n=>`$${n.toFixed(2)}`;
let cart = JSON.parse(localStorage.getItem(CART_KEY)||'[]');
function save(){localStorage.setItem(CART_KEY,JSON.stringify(cart));}
function count(){return cart.reduce((s,i)=>s+i.qty,0);}
function subtotal(){return cart.reduce((s,i)=>s+i.price*i.qty,0);}
function bumpHeader(){const link=$('.cart'); if(link) link.textContent=`CART (${count()})`;}
bumpHeader();
document.addEventListener('click',e=>{
  const b=e.target.closest('.add-to-cart'); if(!b) return;
  const id=b.dataset.id, name=b.dataset.name, price=parseFloat(b.dataset.price), img=b.dataset.img||'';
  let it=cart.find(i=>i.id===id); if(it) it.qty++; else cart.push({id,name,price,img,qty:1});
  save(); bumpHeader(); b.textContent='Added ✓'; setTimeout(()=>b.textContent='Add to Cart',800);
});
function renderCart(){ const body=$('#cart-page-items'); if(!body) return;
  const empty=$('#cart-empty'), sum=$('#sum-subtotal'), ck=$('#sum-checkout');
  body.innerHTML=''; if(cart.length===0){ empty.style.display='block'; sum.textContent=fmt(0); ck.disabled=true; return; }
  empty.style.display='none'; ck.disabled=false;
  cart.forEach(it=>{ const tr=document.createElement('tr'); tr.dataset.id=it.id;
    tr.innerHTML=`<td><div class="cart-item"><img src="${it.img}" alt="${it.name}"><div><strong>${it.name}</strong><br><button class="remove-link">Remove</button></div></div></td>
                  <td>${fmt(it.price)}</td>
                  <td><div class="qty-controls"><button class="dec">−</button><span class="q">${it.qty}</span><button class="inc">+</button></div></td>
                  <td class="line-total">${fmt(it.price*it.qty)}</td>
                  <td><span class="sr">actions</span></td>`;
    body.appendChild(tr);
  }); sum.textContent=fmt(subtotal());
}
renderCart();
document.addEventListener('click',e=>{
  const tr=e.target.closest('tr'); const id=tr && tr.dataset.id; if(!id) return;
  const it=cart.find(i=>i.id===id); if(!it) return;
  if(e.target.classList.contains('inc')) it.qty++;
  else if(e.target.classList.contains('dec')) it.qty=Math.max(1,it.qty-1);
  else if(e.target.classList.contains('remove-link')) cart=cart.filter(i=>i.id!==id);
  else return;
  save(); bumpHeader(); renderCart();
});
const btn=$('#sum-checkout'); if(btn){ btn.addEventListener('click',()=>alert('Checkout coming soon — Stripe/Shopify next.')); }
