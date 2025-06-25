import{f as R,r as a,j as e,L as m,P as S}from"./react-vendor-C_ls207L.js";import{S as c}from"./StandardLayout-CHsFjCWf.js";import{s as N}from"./Resources-BEHiDCZc.js";import"./vendor-DeJPPs1q.js";import"./sanity-BS235U2J.js";import"./PageWrapper-CRYaw3_L.js";import"./Footer-B_S_3MWt.js";var T={};const F=()=>{var x,p,j;const{slug:l}=R(),[s,y]=a.useState(null),[u,k]=a.useState([]),[I,n]=a.useState(!0),[h,o]=a.useState(null);a.useEffect(()=>{(async()=>{if(l){n(!0),o(null);try{const r=await N.fetch(`
          *[_type == "article" && slug.current == $slug][0] {
            title,
            "slug": slug.current,
            publishedOn,
            shortDesc,
            mainImage {
              asset-> {
                _id,
                url
              },
              alt,
              caption,
              attribution
            },
            "categories": categories[]->{ title, "slug": slug.current },
            bodyContent
          }
        `,{slug:l});if(!r){o("Article not found"),n(!1);return}y(r);const b=await N.fetch(`
          *[_type == "article" && 
            slug.current != $slug && 
            count((categories[]->._id)[@ in ^.^.categories[]->._id]) > 0] | order(publishedOn desc)[0...3] {
            title,
            "slug": slug.current,
            shortDesc,
            mainImage,
            publishedOn,
            "categories": categories[]->{ title }
          }
        `,{slug:l});k(b)}catch(i){console.error("Error fetching article:",i),o("Failed to load article")}finally{n(!1)}}})()},[l]);const g=t=>t?new Date(t).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}):"",_={types:{textBlockWithTitle:({value:t})=>e.jsxs("div",{className:"text-block-with-title",children:[e.jsx("h3",{className:"text-block-title",children:t.title}),e.jsx("div",{className:"text-block-body",children:t.bodyText})]}),listBlockWithTitle:({value:t})=>e.jsxs("div",{className:"list-block-with-title",children:[e.jsx("h3",{className:"list-block-title",children:t.title}),t.summaryText&&e.jsx("p",{className:"list-block-summary",children:t.summaryText}),t.ordered?e.jsx("ol",{className:"list-block-items",children:t.items.map((i,r)=>e.jsx("li",{children:i},r))}):e.jsx("ul",{className:"list-block-items",children:t.items.map((i,r)=>e.jsx("li",{children:i},r))})]}),image:({value:t})=>e.jsxs("figure",{className:"article-image",children:[e.jsx("img",{src:d(t,800),alt:t.alt||"",loading:"lazy"}),t.caption&&e.jsx("figcaption",{children:t.caption})]})},marks:{link:({children:t,value:i})=>{const r=i.href.startsWith("/")?void 0:"noreferrer noopener";return e.jsx("a",{href:i.href,rel:r,target:i.blank?"_blank":void 0,children:t})}}},d=(t,i=800,r)=>{if(!t||!t.asset||!t.asset._ref)return"";const f=t.asset._ref,[b,$,A]=f.split("-"),D=`https://cdn.sanity.io/images/${T.REACT_APP_SANITY_PROJECT_ID}/content/`,P=r?`?w=${i}&h=${r}&fit=crop&auto=format`:`?w=${i}&auto=format`;return`${D}${$}.${A}${P}`};return I?e.jsx(c,{title:"Loading article...",children:e.jsx("p",{children:"Loading..."})}):h?e.jsx(c,{title:"Error",children:e.jsxs("p",{children:["Could not load article. ",h]})}):s?e.jsxs(c,{title:s.title,subtitle:(p=(x=s.categories)==null?void 0:x[0])!=null&&p.title?`${s.categories[0].title} - Published on ${g(s.publishedOn)}`:`Published on ${g(s.publishedOn)}`,children:[e.jsxs("div",{className:"article-breadcrumbs",children:[e.jsx(m,{to:"/resources",children:"Resources"}),((j=s.categories)==null?void 0:j[0])&&e.jsxs(e.Fragment,{children:[e.jsx("span",{children:" / "}),e.jsx(m,{to:`/resources?topic=${encodeURIComponent(s.categories[0].title)}`,children:s.categories[0].title})]}),e.jsxs("span",{children:[" / ",s.title]})]}),s.mainImage&&e.jsxs("div",{className:"article-main-image-container",children:[e.jsx("img",{src:d(s.mainImage,800),alt:s.mainImage.alt||s.title,className:"article-main-image"}),s.mainImage.caption&&e.jsxs("figcaption",{className:"article-image-caption",children:[s.mainImage.caption,s.mainImage.attribution&&e.jsxs("span",{className:"image-attribution",children:[" — ",s.mainImage.attribution]})]})]}),e.jsx("div",{className:"article-body-content",children:e.jsx(S,{value:s.bodyContent,components:_})}),u.length>0&&e.jsxs("section",{className:"related-articles-section",children:[e.jsx("h2",{className:"related-articles-title",children:"Related Articles"}),e.jsx("div",{className:"resources-article-grid",children:u.map(t=>e.jsxs("div",{className:"article-card",children:[t.mainImage&&e.jsx("div",{className:"article-image",children:e.jsx("img",{src:d(t.mainImage,300,200),alt:t.title})}),e.jsxs("div",{className:"article-content",children:[e.jsx("h3",{className:"article-title",children:t.title}),t.shortDesc&&e.jsx("p",{className:"article-excerpt",children:t.shortDesc}),e.jsx(m,{to:`/resources/${t.slug}`,className:"read-article-link",children:"Read article →"})]})]},t.slug))})]})]}):e.jsx(c,{title:"Not Found",children:e.jsx("p",{children:"Article not found."})})};export{F as default};
