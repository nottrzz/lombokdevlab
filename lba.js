<script>
function sistemHookAzmiFinal() {
    const semuaTombol = document.querySelectorAll('.woocommerce-loop-product__link, .add_to_cart_button, .button, .tombol-booking, [class*="button"], a.button, a._more.bttn');

    semuaTombol.forEach(button => {
        if (button.innerText.toLowerCase().includes('book') || button.innerText.toLowerCase().includes('order') || button.innerText.toLowerCase().includes('lihat')) {
            
            button.removeAttribute('href');
            button.style.cursor = 'pointer'; 

            button.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();

                const productCard = button.closest('.product') || button.closest('.gb-grid-column') || button.closest('li') || button.parentElement.parentElement;
                
                if (productCard) {
                  
                    const titleEl = productCard.querySelector('.woocommerce-loop-product__title') || productCard.querySelector('h2') || productCard.querySelector('h3');
                    const namaPaket = titleEl ? titleEl.innerText.trim() : 'Paket Tour';
                   
                    let hargaPaket = '';
                    const priceEl = productCard.querySelector('.price') || productCard.querySelector('[class*="price"]');
                    
                    if (priceEl) {
                        hargaPaket = priceEl.innerText.trim();
                    } else if (productCard.innerText.includes('Rp')) {
                        const cocokHarga = productCard.innerText.match(/Rp\s?[0-9\.,]+/i);
                        if (cocokHarga) {
                            hargaPaket = cocokHarga[0];
                        }
                    }

                    if (hargaPaket.includes('\n')) {
                        hargaPaket = hargaPaket.split('\n')[0];
                    }
                    hargaPaket = hargaPaket.replace(/book now|order/gi, '').trim();

                    if (!hargaPaket) {
                        hargaPaket = "Hubungi Admin";
                    }

                    const urlFinal = `${window.location.origin}/index.php/whatsform/?paket=${encodeURIComponent(namaPaket)}&harga=${encodeURIComponent(hargaPaket)}`;
                    
                    window.open(urlFinal, '_blank');
                }
            };
        }
    });
}

	
// 	bismillah bisa dah inshaallahhhh🔥🔥🔥
document.addEventListener("DOMContentLoaded", sistemHookAzmiFinal);
window.addEventListener("load", sistemHookAzmiFinal);
setTimeout(sistemHookAzmiFinal, 1500);
</script> -->

<script>
function sistemHookAzmiFinalV15() {
    const selektorTombol = [
        '.woocommerce-loop-product__link',
        '.add_to_cart_button',
        '.single_add_to_cart_button',
        '.button',
        '.tombol-booking',
        'a.button',
        'button.button',
        '.wp-block-button__link',
        '[class*="button"]',
        'a',
        'button'
    ].join(', ');

    const semuaTombol = document.querySelectorAll(selektorTombol);

    semuaTombol.forEach(button => {
        const teksTombol = button.innerText.toLowerCase();
        
        if (teksTombol.includes('book') || teksTombol.includes('order') || teksTombol.includes('inquiry')) {
            
            button.removeAttribute('href');
            button.setAttribute('type', 'button');
            button.style.cursor = 'pointer'; 

            button.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();

                let namaPaket = '';
                let hargaPaket = '';

                // =================================================================
                // 1. AMBIL NAMA PAKET DARI TAB BROWSER (UDAH FIX 100% SUKSES)
                // =================================================================
                let judulBrowser = document.title;
                if (judulBrowser.includes('-')) {
                    namaPaket = judulBrowser.split('-')[0].trim();
                } else if (judulBrowser.includes('|')) {
                    namaPaket = judulBrowser.split('|')[0].trim();
                } else {
                    namaPaket = judulBrowser.trim();
                }

                // =================================================================
                // 2. KONDISI 1: JIKA DIKLIK DARI HALAMAN KATALOG UTAMA (CARD DEPAN)
                // =================================================================
                const containerCard = button.closest('.product') || button.closest('.gb-grid-column') || button.closest('li.product');
                
                if (containerCard && !document.body.classList.contains('single-product')) {
                    // Ambil nama dari card biar gak bentrok
                    const titleEl = containerCard.querySelector('.woocommerce-loop-product__title') || containerCard.querySelector('h2') || containerCard.querySelector('h3');
                    if (titleEl) namaPaket = titleEl.innerText.trim();

                    // Ambil harga langsung dari card depan (Kan di depan ada harganya)
                    const priceEl = containerCard.querySelector('.price') || containerCard.querySelector('bdi');
                    if (priceEl) {
                        hargaPaket = priceEl.innerText.trim();
                        
                        // Bersihkan teks harga jika berhasil didapat
                        if (hargaPaket.includes('\n')) hargaPaket = hargaPaket.split('\n')[0];
                        hargaPaket = hargaPaket.replace(/book now|order|inquiry/gi, '').trim();
                        
                        // Langsung lempar ke whatsform
                        bukaHalamanWhatsform(namaPaket, hargaPaket);
                        return;
                    }
                } 
                
                // =================================================================
                // 3. KONDISI 2: JIKA DIKLIK DARI PAGES VIEW DETAIL (PRODUK ID API)
                // =================================================================
                else {
                    // Cari ID Produk WooCommerce di class body halaman detail
                    // Biasanya formatnya: postid-XXXX atau product-id-XXXX
                    let idProduk = '';
                    const bodyClasses = document.body.className.split(' ');
                    for (let i = 0; i < bodyClasses.length; i++) {
                        if (bodyClasses[i].startsWith('postid-')) {
                            idProduk = bodyClasses[i].split('-')[1];
                            break;
                        } else if (bodyClasses[i].startsWith('product-id-')) {
                            idProduk = bodyClasses[i].split('-')[2];
                            break;
                        }
                    }

                    // Jika ID Produk ketemu, tembak API internal WordPress lo buat nyari harganya langsung dari database pusat!
                    if (idProduk) {
                        fetch(`${window.location.origin}/wp-json/wp/v2/product/${idProduk}`)
                        .then(response => {
                            if (!response.ok) {
                                // Jika custom post type bawaan tema beda, coba tembak rest default wc
                                return fetch(`${window.location.origin}/wp-json/wc/store/v1/products/${idProduk}`);
                            }
                            return response.json();
                        })
                        .then(data => {
                            // Ambil harga dari response API database
                            if (data && data.prices && data.prices.price) {
                                // Format harga dari store API wc
                                let hargaMentah = (parseInt(data.prices.price) / Math.pow(10, data.prices.currency_minor_units || 0));
                                hargaPaket = "Rp " + hargaMentah.toLocaleString('id-ID');
                            } else if (data && data.price_html) {
                                // Jika dapetnya price_html bawaan data, kita bersihkan tag html-nya
                                const divTmp = document.createElement("div");
                                divTmp.innerHTML = data.price_html;
                                hargaPaket = divTmp.innerText.trim();
                                if (hargaPaket.includes('\n')) hargaPaket = hargaPaket.split('\n')[0];
                            } else {
                                // Taktik scan teks darurat jika API gagal rest data harganya
                                const cocokRp = document.body.innerText.match(/Rp\.?\s?[0-9\.,]+/i);
                                hargaPaket = cocokRp ? cocokRp[0] : "Hubungi Admin";
                            }
                            bukaHalamanWhatsform(namaPaket, hargaPaket);
                        })
                        .catch(err => {
                            // Jika terjadi error koneksi API, lempar backup teks kasaran
                            const cocokRp = document.body.innerText.match(/Rp\.?\s?[0-9\.,]+/i);
                            bukaHalamanWhatsform(namaPaket, cocokRp ? cocokRp[0] : "Hubungi Admin");
                        });
                        return; // Menunggu proses API fetch beres
                    }
                }

                // Pengaman terakhir jika semua kondisi di atas mentok lewati batas
                const cocokRpSaja = document.body.innerText.match(/Rp\.?\s?[0-9\.,]+/i);
                hargaPaket = cocokRpSaja ? cocokRpSaja[0] : "Hubungi Admin";
                bukaHalamanWhatsform(namaPaket, hargaPaket);
            };
        }
    });

    // Fungsi pembantu buat redirect link secara rapi dan aman
    function bukaHalamanWhatsform(nama, harga) {
        if (harga) {
            harga = harga.replace(/book now|order|share it|inquiry/gi, '').trim();
        }
        const urlFinal = `${window.location.origin}/index.php/whatsform/?paket=${encodeURIComponent(nama)}&harga=${encodeURIComponent(harga)}`;
        window.open(urlFinal, '_blank');
    }
}

// Eksekusi paksa di WordPress lo
document.addEventListener("DOMContentLoaded", sistemHookAzmiFinalV15);
window.addEventListener("load", sistemHookAzmiFinalV15);
setTimeout(sistemHookAzmiFinalV15, 1000);
setTimeout(sistemHookAzmiFinalV15, 2500);
</script>