import{f as A,r as s,R as e,L as u,P as R}from"./react-D8qwWWc-.js";import{S as i}from"./StandardLayout-CODG-ZJt.js";import{s as b}from"./Resources-B756soms.js";import"./vendor-BRRJ753s.js";import"./PageWrapper-qXWqd5_q.js";import"./Footer-DbTn4dsc.js";var D={};const O=()=>{const{slug:c}=A(),[a,h]=s.useState(null),[g,y]=s.useState([]),[N,n]=s.useState(!0),[d,o]=s.useState(null);s.useEffect(()=>{(async()=>{if(c){n(!0),o(null);try{const l=await b.fetch(`
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
        `,{slug:c});if(!l){o("Article not found"),n(!1);return}h(l);const f=await b.fetch(`
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
        `,{slug:c});y(f)}catch(r){console.error("Error fetching article:",r),o("Failed to load article")}finally{n(!1)}}})()},[c]);const E=t=>t?new Date(t).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}):"",k={types:{textBlockWithTitle:({value:t})=>e.createElement("div",{className:"text-block-with-title"},e.createElement("h3",{className:"text-block-title"},t.title),e.createElement("div",{className:"text-block-body"},t.bodyText)),listBlockWithTitle:({value:t})=>e.createElement("div",{className:"list-block-with-title"},e.createElement("h3",{className:"list-block-title"},t.title),t.summaryText&&e.createElement("p",{className:"list-block-summary"},t.summaryText),t.ordered?e.createElement("ol",{className:"list-block-items"},t.items.map((r,l)=>e.createElement("li",{key:l},r))):e.createElement("ul",{className:"list-block-items"},t.items.map((r,l)=>e.createElement("li",{key:l},r)))),image:({value:t})=>e.createElement("figure",{className:"article-image"},e.createElement("img",{src:m(t,800),alt:t.alt||"",loading:"lazy"}),t.caption&&e.createElement("figcaption",null,t.caption))},marks:{link:({children:t,value:r})=>{const l=r.href.startsWith("/")?void 0:"noreferrer noopener";return e.createElement("a",{href:r.href,rel:l,target:r.blank?"_blank":void 0},t)}}},m=(t,r=800,l)=>{if(!t||!t.asset||!t.asset._ref)return"";const p=t.asset._ref,[f,I,_]=p.split("-"),$=`https://cdn.sanity.io/images/${D.REACT_APP_SANITY_PROJECT_ID}/content/`,x=l?`?w=${r}&h=${l}&fit=crop&auto=format`:`?w=${r}&auto=format`;return`${$}${I}.${_}${x}`};return N?e.createElement(i,{title:"Loading article..."},e.createElement("p",null,"Loading...")):d?e.createElement(i,{title:"Error"},e.createElement("p",null,"Could not load article. ",d)):a?e.createElement(i,{title:a.title,subtitle:a.categories?.[0]?.title?`${a.categories[0].title} - Published on ${E(a.publishedOn)}`:`Published on ${E(a.publishedOn)}`},e.createElement("div",{className:"article-breadcrumbs"},e.createElement(u,{to:"/resources"},"Resources"),a.categories?.[0]&&e.createElement(e.Fragment,null,e.createElement("span",null," / "),e.createElement(u,{to:`/resources?topic=${encodeURIComponent(a.categories[0].title)}`},a.categories[0].title)),e.createElement("span",null," / ",a.title)),a.mainImage&&e.createElement("div",{className:"article-main-image-container"},e.createElement("img",{src:m(a.mainImage,800),alt:a.mainImage.alt||a.title,className:"article-main-image"}),a.mainImage.caption&&e.createElement("figcaption",{className:"article-image-caption"},a.mainImage.caption,a.mainImage.attribution&&e.createElement("span",{className:"image-attribution"}," — ",a.mainImage.attribution))),e.createElement("div",{className:"article-body-content"},e.createElement(R,{value:a.bodyContent,components:k})),g.length>0&&e.createElement("section",{className:"related-articles-section"},e.createElement("h2",{className:"related-articles-title"},"Related Articles"),e.createElement("div",{className:"resources-article-grid"},g.map(t=>e.createElement("div",{key:t.slug,className:"article-card"},t.mainImage&&e.createElement("div",{className:"article-image"},e.createElement("img",{src:m(t.mainImage,300,200),alt:t.title})),e.createElement("div",{className:"article-content"},e.createElement("h3",{className:"article-title"},t.title),t.shortDesc&&e.createElement("p",{className:"article-excerpt"},t.shortDesc),e.createElement(u,{to:`/resources/${t.slug}`,className:"read-article-link"},"Read article →"))))))):e.createElement(i,{title:"Not Found"},e.createElement("p",null,"Article not found."))};export{O as default};
