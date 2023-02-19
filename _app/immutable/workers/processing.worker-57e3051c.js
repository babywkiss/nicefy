(function(){"use strict";const d=(e,r,b)=>{const t=Math.floor(r.height/b),g=Math.floor(r.width/b),o=r.channels,i={...r,width:g,height:t},f=new Uint8ClampedArray(g*t*o),w=b>=1?b**2:1;for(let x=0;x<t;x++)for(let m=0;m<g;m++){const c=Array(o).fill(0);for(let n=0;n<b;n++)for(let p=0;p<b;p++)for(let u=0;u<o;u++)c[u]+=e[o*((Math.floor(x*b)+n)*r.width+(Math.floor(m*b)+p))+u]/w;for(let n=0;n<r.channels;n++)f[r.channels*(x*g+m)+n]=c[n]}return{data:f,info:i}},k=(e,r,b,t)=>{const g=b.length**.5,{width:o,height:i,channels:f}=r;for(let w=0;w<i;w++)for(let x=0;x<o;x++){const m=t*b[w%g*g+x%g];for(let c=0;c<f;c++){const p=e[f*(w*o+x)+c]+m;e[f*(w*o+x)+c]=p<=255?p>=0?p:0:255}}},_=(e,r,b)=>{const{width:t,height:g,channels:o}=r,i=b.length;for(let f=0;f<g;f++)for(let w=0;w<t;w++){let x=1/0,m=0;for(let c=0;c<i;c++){let n=0;for(let p=0;p<o;p++)n+=(b[c][p]-e[o*(f*t+w)+p])**2;n<x&&(x=n,m=c)}for(let c=0;c<o;c++)e[o*(f*t+w)+c]=b[m][c]}},y=e=>{if(e===0)return[0,2,3,1];const r=y(e-1),b=r.length**.5,t=4**(e+1),g=t**.5;return Array.from({length:t},(o,i)=>{const f=i%g,w=Math.floor(i/g),x=f<g/2,m=w<g/2,c=x?m?0:3:m?2:1;return r[w%b*b+f%b]*4+c})},M=e=>y(e).map(r=>r/4**(e+1)-.5),a={rosewater:{hex:"#dc8a78",rgb:"rgb(220, 138, 120)",hsl:"hsl(11, 59%, 67%)",raw:"220, 138, 120"},flamingo:{hex:"#dd7878",rgb:"rgb(221, 120, 120)",hsl:"hsl(0, 60%, 67%)",raw:"221, 120, 120"},pink:{hex:"#ea76cb",rgb:"rgb(234, 118, 203)",hsl:"hsl(316, 73%, 69%)",raw:"234, 118, 203"},mauve:{hex:"#8839ef",rgb:"rgb(136, 57, 239)",hsl:"hsl(266, 85%, 58%)",raw:"136, 57, 239"},red:{hex:"#d20f39",rgb:"rgb(210, 15, 57)",hsl:"hsl(347, 87%, 44%)",raw:"210, 15, 57"},maroon:{hex:"#e64553",rgb:"rgb(230, 69, 83)",hsl:"hsl(355, 76%, 59%)",raw:"230, 69, 83"},peach:{hex:"#fe640b",rgb:"rgb(254, 100, 11)",hsl:"hsl(22, 99%, 52%)",raw:"254, 100, 11"},yellow:{hex:"#df8e1d",rgb:"rgb(223, 142, 29)",hsl:"hsl(35, 77%, 49%)",raw:"223, 142, 29"},green:{hex:"#40a02b",rgb:"rgb(64, 160, 43)",hsl:"hsl(109, 58%, 40%)",raw:"64, 160, 43"},teal:{hex:"#179299",rgb:"rgb(23, 146, 153)",hsl:"hsl(183, 74%, 35%)",raw:"23, 146, 153"},sky:{hex:"#04a5e5",rgb:"rgb(4, 165, 229)",hsl:"hsl(197, 97%, 46%)",raw:"4, 165, 229"},sapphire:{hex:"#209fb5",rgb:"rgb(32, 159, 181)",hsl:"hsl(189, 70%, 42%)",raw:"32, 159, 181"},blue:{hex:"#1e66f5",rgb:"rgb(30, 102, 245)",hsl:"hsl(220, 91%, 54%)",raw:"30, 102, 245"},lavender:{hex:"#7287fd",rgb:"rgb(114, 135, 253)",hsl:"hsl(231, 97%, 72%)",raw:"114, 135, 253"},text:{hex:"#4c4f69",rgb:"rgb(76, 79, 105)",hsl:"hsl(234, 16%, 35%)",raw:"76, 79, 105"},subtext1:{hex:"#5c5f77",rgb:"rgb(92, 95, 119)",hsl:"hsl(233, 13%, 41%)",raw:"92, 95, 119"},subtext0:{hex:"#6c6f85",rgb:"rgb(108, 111, 133)",hsl:"hsl(233, 10%, 47%)",raw:"108, 111, 133"},overlay2:{hex:"#7c7f93",rgb:"rgb(124, 127, 147)",hsl:"hsl(232, 10%, 53%)",raw:"124, 127, 147"},overlay1:{hex:"#8c8fa1",rgb:"rgb(140, 143, 161)",hsl:"hsl(231, 10%, 59%)",raw:"140, 143, 161"},overlay0:{hex:"#9ca0b0",rgb:"rgb(156, 160, 176)",hsl:"hsl(228, 11%, 65%)",raw:"156, 160, 176"},surface2:{hex:"#acb0be",rgb:"rgb(172, 176, 190)",hsl:"hsl(227, 12%, 71%)",raw:"172, 176, 190"},surface1:{hex:"#bcc0cc",rgb:"rgb(188, 192, 204)",hsl:"hsl(225, 14%, 77%)",raw:"188, 192, 204"},surface0:{hex:"#ccd0da",rgb:"rgb(204, 208, 218)",hsl:"hsl(223, 16%, 83%)",raw:"204, 208, 218"},base:{hex:"#eff1f5",rgb:"rgb(239, 241, 245)",hsl:"hsl(220, 23%, 95%)",raw:"239, 241, 245"},mantle:{hex:"#e6e9ef",rgb:"rgb(230, 233, 239)",hsl:"hsl(220, 22%, 92%)",raw:"230, 233, 239"},crust:{hex:"#dce0e8",rgb:"rgb(220, 224, 232)",hsl:"hsl(220, 21%, 89%)",raw:"220, 224, 232"}},h={rosewater:{hex:"#f2d5cf",rgb:"rgb(242, 213, 207)",hsl:"hsl(10, 57%, 88%)",raw:"242, 213, 207"},flamingo:{hex:"#eebebe",rgb:"rgb(238, 190, 190)",hsl:"hsl(0, 59%, 84%)",raw:"238, 190, 190"},pink:{hex:"#f4b8e4",rgb:"rgb(244, 184, 228)",hsl:"hsl(316, 73%, 84%)",raw:"244, 184, 228"},mauve:{hex:"#ca9ee6",rgb:"rgb(202, 158, 230)",hsl:"hsl(277, 59%, 76%)",raw:"202, 158, 230"},red:{hex:"#e78284",rgb:"rgb(231, 130, 132)",hsl:"hsl(359, 68%, 71%)",raw:"231, 130, 132"},maroon:{hex:"#ea999c",rgb:"rgb(234, 153, 156)",hsl:"hsl(358, 66%, 76%)",raw:"234, 153, 156"},peach:{hex:"#ef9f76",rgb:"rgb(239, 159, 118)",hsl:"hsl(20, 79%, 70%)",raw:"239, 159, 118"},yellow:{hex:"#e5c890",rgb:"rgb(229, 200, 144)",hsl:"hsl(40, 62%, 73%)",raw:"229, 200, 144"},green:{hex:"#a6d189",rgb:"rgb(166, 209, 137)",hsl:"hsl(96, 44%, 68%)",raw:"166, 209, 137"},teal:{hex:"#81c8be",rgb:"rgb(129, 200, 190)",hsl:"hsl(172, 39%, 65%)",raw:"129, 200, 190"},sky:{hex:"#99d1db",rgb:"rgb(153, 209, 219)",hsl:"hsl(189, 48%, 73%)",raw:"153, 209, 219"},sapphire:{hex:"#85c1dc",rgb:"rgb(133, 193, 220)",hsl:"hsl(199, 55%, 69%)",raw:"133, 193, 220"},blue:{hex:"#8caaee",rgb:"rgb(140, 170, 238)",hsl:"hsl(222, 74%, 74%)",raw:"140, 170, 238"},lavender:{hex:"#babbf1",rgb:"rgb(186, 187, 241)",hsl:"hsl(239, 66%, 84%)",raw:"186, 187, 241"},text:{hex:"#c6d0f5",rgb:"rgb(198, 208, 245)",hsl:"hsl(227, 70%, 87%)",raw:"198, 208, 245"},subtext1:{hex:"#b5bfe2",rgb:"rgb(181, 191, 226)",hsl:"hsl(227, 44%, 80%)",raw:"181, 191, 226"},subtext0:{hex:"#a5adce",rgb:"rgb(165, 173, 206)",hsl:"hsl(228, 29%, 73%)",raw:"165, 173, 206"},overlay2:{hex:"#949cbb",rgb:"rgb(148, 156, 187)",hsl:"hsl(228, 22%, 66%)",raw:"148, 156, 187"},overlay1:{hex:"#838ba7",rgb:"rgb(131, 139, 167)",hsl:"hsl(227, 17%, 58%)",raw:"131, 139, 167"},overlay0:{hex:"#737994",rgb:"rgb(115, 121, 148)",hsl:"hsl(229, 13%, 52%)",raw:"115, 121, 148"},surface2:{hex:"#626880",rgb:"rgb(98, 104, 128)",hsl:"hsl(228, 13%, 44%)",raw:"98, 104, 128"},surface1:{hex:"#51576d",rgb:"rgb(81, 87, 109)",hsl:"hsl(227, 15%, 37%)",raw:"81, 87, 109"},surface0:{hex:"#414559",rgb:"rgb(65, 69, 89)",hsl:"hsl(230, 16%, 30%)",raw:"65, 69, 89"},base:{hex:"#303446",rgb:"rgb(48, 52, 70)",hsl:"hsl(229, 19%, 23%)",raw:"48, 52, 70"},mantle:{hex:"#292c3c",rgb:"rgb(41, 44, 60)",hsl:"hsl(231, 19%, 20%)",raw:"41, 44, 60"},crust:{hex:"#232634",rgb:"rgb(35, 38, 52)",hsl:"hsl(229, 20%, 17%)",raw:"35, 38, 52"}},s={rosewater:{hex:"#f4dbd6",rgb:"rgb(244, 219, 214)",hsl:"hsl(10, 58%, 90%)",raw:"244, 219, 214"},flamingo:{hex:"#f0c6c6",rgb:"rgb(240, 198, 198)",hsl:"hsl(0, 58%, 86%)",raw:"240, 198, 198"},pink:{hex:"#f5bde6",rgb:"rgb(245, 189, 230)",hsl:"hsl(316, 74%, 85%)",raw:"245, 189, 230"},mauve:{hex:"#c6a0f6",rgb:"rgb(198, 160, 246)",hsl:"hsl(267, 83%, 80%)",raw:"198, 160, 246"},red:{hex:"#ed8796",rgb:"rgb(237, 135, 150)",hsl:"hsl(351, 74%, 73%)",raw:"237, 135, 150"},maroon:{hex:"#ee99a0",rgb:"rgb(238, 153, 160)",hsl:"hsl(355, 71%, 77%)",raw:"238, 153, 160"},peach:{hex:"#f5a97f",rgb:"rgb(245, 169, 127)",hsl:"hsl(21, 86%, 73%)",raw:"245, 169, 127"},yellow:{hex:"#eed49f",rgb:"rgb(238, 212, 159)",hsl:"hsl(40, 70%, 78%)",raw:"238, 212, 159"},green:{hex:"#a6da95",rgb:"rgb(166, 218, 149)",hsl:"hsl(105, 48%, 72%)",raw:"166, 218, 149"},teal:{hex:"#8bd5ca",rgb:"rgb(139, 213, 202)",hsl:"hsl(171, 47%, 69%)",raw:"139, 213, 202"},sky:{hex:"#91d7e3",rgb:"rgb(145, 215, 227)",hsl:"hsl(189, 59%, 73%)",raw:"145, 215, 227"},sapphire:{hex:"#7dc4e4",rgb:"rgb(125, 196, 228)",hsl:"hsl(199, 66%, 69%)",raw:"125, 196, 228"},blue:{hex:"#8aadf4",rgb:"rgb(138, 173, 244)",hsl:"hsl(220, 83%, 75%)",raw:"138, 173, 244"},lavender:{hex:"#b7bdf8",rgb:"rgb(183, 189, 248)",hsl:"hsl(234, 82%, 85%)",raw:"183, 189, 248"},text:{hex:"#cad3f5",rgb:"rgb(202, 211, 245)",hsl:"hsl(227, 68%, 88%)",raw:"202, 211, 245"},subtext1:{hex:"#b8c0e0",rgb:"rgb(184, 192, 224)",hsl:"hsl(228, 39%, 80%)",raw:"184, 192, 224"},subtext0:{hex:"#a5adcb",rgb:"rgb(165, 173, 203)",hsl:"hsl(227, 27%, 72%)",raw:"165, 173, 203"},overlay2:{hex:"#939ab7",rgb:"rgb(147, 154, 183)",hsl:"hsl(228, 20%, 65%)",raw:"147, 154, 183"},overlay1:{hex:"#8087a2",rgb:"rgb(128, 135, 162)",hsl:"hsl(228, 15%, 57%)",raw:"128, 135, 162"},overlay0:{hex:"#6e738d",rgb:"rgb(110, 115, 141)",hsl:"hsl(230, 12%, 49%)",raw:"110, 115, 141"},surface2:{hex:"#5b6078",rgb:"rgb(91, 96, 120)",hsl:"hsl(230, 14%, 41%)",raw:"91, 96, 120"},surface1:{hex:"#494d64",rgb:"rgb(73, 77, 100)",hsl:"hsl(231, 16%, 34%)",raw:"73, 77, 100"},surface0:{hex:"#363a4f",rgb:"rgb(54, 58, 79)",hsl:"hsl(230, 19%, 26%)",raw:"54, 58, 79"},base:{hex:"#24273a",rgb:"rgb(36, 39, 58)",hsl:"hsl(232, 23%, 18%)",raw:"36, 39, 58"},mantle:{hex:"#1e2030",rgb:"rgb(30, 32, 48)",hsl:"hsl(233, 23%, 15%)",raw:"30, 32, 48"},crust:{hex:"#181926",rgb:"rgb(24, 25, 38)",hsl:"hsl(236, 23%, 12%)",raw:"24, 25, 38"}},l={rosewater:{hex:"#f5e0dc",rgb:"rgb(245, 224, 220)",hsl:"hsl(10, 56%, 91%)",raw:"245, 224, 220"},flamingo:{hex:"#f2cdcd",rgb:"rgb(242, 205, 205)",hsl:"hsl(0, 59%, 88%)",raw:"242, 205, 205"},pink:{hex:"#f5c2e7",rgb:"rgb(245, 194, 231)",hsl:"hsl(316, 72%, 86%)",raw:"245, 194, 231"},mauve:{hex:"#cba6f7",rgb:"rgb(203, 166, 247)",hsl:"hsl(267, 84%, 81%)",raw:"203, 166, 247"},red:{hex:"#f38ba8",rgb:"rgb(243, 139, 168)",hsl:"hsl(343, 81%, 75%)",raw:"243, 139, 168"},maroon:{hex:"#eba0ac",rgb:"rgb(235, 160, 172)",hsl:"hsl(350, 65%, 77%)",raw:"235, 160, 172"},peach:{hex:"#fab387",rgb:"rgb(250, 179, 135)",hsl:"hsl(23, 92%, 75%)",raw:"250, 179, 135"},yellow:{hex:"#f9e2af",rgb:"rgb(249, 226, 175)",hsl:"hsl(41, 86%, 83%)",raw:"249, 226, 175"},green:{hex:"#a6e3a1",rgb:"rgb(166, 227, 161)",hsl:"hsl(115, 54%, 76%)",raw:"166, 227, 161"},teal:{hex:"#94e2d5",rgb:"rgb(148, 226, 213)",hsl:"hsl(170, 57%, 73%)",raw:"148, 226, 213"},sky:{hex:"#89dceb",rgb:"rgb(137, 220, 235)",hsl:"hsl(189, 71%, 73%)",raw:"137, 220, 235"},sapphire:{hex:"#74c7ec",rgb:"rgb(116, 199, 236)",hsl:"hsl(199, 76%, 69%)",raw:"116, 199, 236"},blue:{hex:"#89b4fa",rgb:"rgb(137, 180, 250)",hsl:"hsl(217, 92%, 76%)",raw:"137, 180, 250"},lavender:{hex:"#b4befe",rgb:"rgb(180, 190, 254)",hsl:"hsl(232, 97%, 85%)",raw:"180, 190, 254"},text:{hex:"#cdd6f4",rgb:"rgb(205, 214, 244)",hsl:"hsl(226, 64%, 88%)",raw:"205, 214, 244"},subtext1:{hex:"#bac2de",rgb:"rgb(186, 194, 222)",hsl:"hsl(227, 35%, 80%)",raw:"186, 194, 222"},subtext0:{hex:"#a6adc8",rgb:"rgb(166, 173, 200)",hsl:"hsl(228, 24%, 72%)",raw:"166, 173, 200"},overlay2:{hex:"#9399b2",rgb:"rgb(147, 153, 178)",hsl:"hsl(228, 17%, 64%)",raw:"147, 153, 178"},overlay1:{hex:"#7f849c",rgb:"rgb(127, 132, 156)",hsl:"hsl(230, 13%, 55%)",raw:"127, 132, 156"},overlay0:{hex:"#6c7086",rgb:"rgb(108, 112, 134)",hsl:"hsl(231, 11%, 47%)",raw:"108, 112, 134"},surface2:{hex:"#585b70",rgb:"rgb(88, 91, 112)",hsl:"hsl(233, 12%, 39%)",raw:"88, 91, 112"},surface1:{hex:"#45475a",rgb:"rgb(69, 71, 90)",hsl:"hsl(234, 13%, 31%)",raw:"69, 71, 90"},surface0:{hex:"#313244",rgb:"rgb(49, 50, 68)",hsl:"hsl(237, 16%, 23%)",raw:"49, 50, 68"},base:{hex:"#1e1e2e",rgb:"rgb(30, 30, 46)",hsl:"hsl(240, 21%, 15%)",raw:"30, 30, 46"},mantle:{hex:"#181825",rgb:"rgb(24, 24, 37)",hsl:"hsl(240, 21%, 12%)",raw:"24, 24, 37"},crust:{hex:"#11111b",rgb:"rgb(17, 17, 27)",hsl:"hsl(240, 23%, 9%)",raw:"17, 17, 27"}},O={variants:{latte:a,frappe:h,macchiato:s,mocha:l},labels:{rosewater:{latte:a.rosewater,frappe:h.rosewater,macchiato:s.rosewater,mocha:l.rosewater},flamingo:{latte:a.flamingo,frappe:h.flamingo,macchiato:s.flamingo,mocha:l.flamingo},pink:{latte:a.pink,frappe:h.pink,macchiato:s.pink,mocha:l.pink},mauve:{latte:a.mauve,frappe:h.mauve,macchiato:s.mauve,mocha:l.mauve},red:{latte:a.red,frappe:h.red,macchiato:s.red,mocha:l.red},maroon:{latte:a.maroon,frappe:h.maroon,macchiato:s.maroon,mocha:l.maroon},peach:{latte:a.peach,frappe:h.peach,macchiato:s.peach,mocha:l.peach},yellow:{latte:a.yellow,frappe:h.yellow,macchiato:s.yellow,mocha:l.yellow},green:{latte:a.green,frappe:h.green,macchiato:s.green,mocha:l.green},teal:{latte:a.teal,frappe:h.teal,macchiato:s.teal,mocha:l.teal},sky:{latte:a.sky,frappe:h.sky,macchiato:s.sky,mocha:l.sky},sapphire:{latte:a.sapphire,frappe:h.sapphire,macchiato:s.sapphire,mocha:l.sapphire},blue:{latte:a.blue,frappe:h.blue,macchiato:s.blue,mocha:l.blue},lavender:{latte:a.lavender,frappe:h.lavender,macchiato:s.lavender,mocha:l.lavender},text:{latte:a.text,frappe:h.text,macchiato:s.text,mocha:l.text},subtext1:{latte:a.subtext1,frappe:h.subtext1,macchiato:s.subtext1,mocha:l.subtext1},subtext0:{latte:a.subtext0,frappe:h.subtext0,macchiato:s.subtext0,mocha:l.subtext0},overlay2:{latte:a.overlay2,frappe:h.overlay2,macchiato:s.overlay2,mocha:l.overlay2},overlay1:{latte:a.overlay1,frappe:h.overlay1,macchiato:s.overlay1,mocha:l.overlay1},overlay0:{latte:a.overlay0,frappe:h.overlay0,macchiato:s.overlay0,mocha:l.overlay0},surface2:{latte:a.surface2,frappe:h.surface2,macchiato:s.surface2,mocha:l.surface2},surface1:{latte:a.surface1,frappe:h.surface1,macchiato:s.surface1,mocha:l.surface1},surface0:{latte:a.surface0,frappe:h.surface0,macchiato:s.surface0,mocha:l.surface0},base:{latte:a.base,frappe:h.base,macchiato:s.base,mocha:l.base},mantle:{latte:a.mantle,frappe:h.mantle,macchiato:s.mantle,mocha:l.mantle},crust:{latte:a.crust,frappe:h.crust,macchiato:s.crust,mocha:l.crust}}},{variants:v,labels:A}=O,D=Object.keys(v).reduce((e,r)=>(e[r]=Object.entries(v[r]).map(([b,t])=>[...t.raw.split(", ").map(g=>parseInt(g)),255]),e),{}),I=(e,r,b)=>{const{pixelSize:t,palette:g,to_dither:o,bayer_level:i,noiseLevel:f}=b;return t>1&&({data:e,info:r}=d(e,r,t)),o&&k(e,r,M(i),f),t>1&&({data:e,info:r}=d(e,r,1/t)),_(e,r,D[g]),new ImageData(e,r.width,r.height)};onmessage=({data:e})=>{const r=I(e.data,e.info,e.config);postMessage(r)}})();