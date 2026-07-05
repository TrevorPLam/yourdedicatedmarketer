import{c as e,i as t}from"./preload-helper-BtWQueYT.js";import{V as n,_ as r}from"./iframe-BR27ozWw.js";import{n as i,t as a}from"./utils-DRwNO7Pn.js";import{n as o,t as s}from"./button-D2NcNVIt.js";var c,l,u,d,f,p,m,h,g=t((()=>{c=r(),l=e(n(),1),i(),u=l.forwardRef(({className:e,...t},n)=>(0,c.jsx)(`div`,{ref:n,className:a(`rounded-lg border bg-card text-card-foreground shadow-sm`,e),...t})),u.displayName=`Card`,d=l.forwardRef(({className:e,...t},n)=>(0,c.jsx)(`div`,{ref:n,className:a(`flex flex-col space-y-1.5 p-6`,e),...t})),d.displayName=`CardHeader`,f=l.forwardRef(({className:e,...t},n)=>(0,c.jsx)(`h3`,{ref:n,className:a(`text-2xl font-semibold leading-none tracking-tight`,e),...t})),f.displayName=`CardTitle`,p=l.forwardRef(({className:e,...t},n)=>(0,c.jsx)(`p`,{ref:n,className:a(`text-sm text-muted-foreground`,e),...t})),p.displayName=`CardDescription`,m=l.forwardRef(({className:e,...t},n)=>(0,c.jsx)(`div`,{ref:n,className:a(`p-6 pt-0`,e),...t})),m.displayName=`CardContent`,h=l.forwardRef(({className:e,...t},n)=>(0,c.jsx)(`div`,{ref:n,className:a(`flex items-center p-6 pt-0`,e),...t})),h.displayName=`CardFooter`,u.__docgenInfo={description:``,methods:[],displayName:`Card`},d.__docgenInfo={description:``,methods:[],displayName:`CardHeader`},h.__docgenInfo={description:``,methods:[],displayName:`CardFooter`},f.__docgenInfo={description:``,methods:[],displayName:`CardTitle`},p.__docgenInfo={description:``,methods:[],displayName:`CardDescription`},m.__docgenInfo={description:``,methods:[],displayName:`CardContent`}})),_,v,y,b,x,S,C,w,T;t((()=>{_=r(),g(),o(),v={title:`UI/Card`,component:u,parameters:{layout:`centered`},tags:[`autodocs`]},y={render:()=>(0,_.jsxs)(u,{className:`w-[350px]`,children:[(0,_.jsxs)(d,{children:[(0,_.jsx)(f,{children:`Card Title`}),(0,_.jsx)(p,{children:`Card description goes here`})]}),(0,_.jsx)(m,{children:(0,_.jsx)(`p`,{children:`Card content goes here. This is the main body of the card.`})}),(0,_.jsx)(h,{children:(0,_.jsx)(s,{children:`Action`})})]})},b={render:()=>(0,_.jsxs)(u,{className:`w-[350px]`,children:[(0,_.jsxs)(d,{children:[(0,_.jsx)(f,{children:`Card Title`}),(0,_.jsx)(p,{children:`Card description goes here`})]}),(0,_.jsx)(m,{children:(0,_.jsx)(`p`,{children:`Card content goes here. This card has no footer.`})})]})},x={render:()=>(0,_.jsxs)(u,{className:`w-[350px]`,children:[(0,_.jsx)(m,{children:(0,_.jsx)(`p`,{children:`This card has no header, just content.`})}),(0,_.jsx)(h,{children:(0,_.jsx)(s,{children:`Action`})})]})},S={render:()=>(0,_.jsx)(u,{className:`w-[350px]`,children:(0,_.jsx)(m,{children:(0,_.jsx)(`p`,{children:`This card has only content, no header or footer.`})})})},C={render:()=>(0,_.jsxs)(u,{className:`w-[350px]`,children:[(0,_.jsxs)(d,{children:[(0,_.jsx)(f,{children:`Confirm Action`}),(0,_.jsx)(p,{children:`Are you sure you want to proceed?`})]}),(0,_.jsx)(m,{children:(0,_.jsx)(`p`,{children:`This action cannot be undone.`})}),(0,_.jsxs)(h,{className:`flex justify-end gap-2`,children:[(0,_.jsx)(s,{variant:`outline`,children:`Cancel`}),(0,_.jsx)(s,{variant:`destructive`,children:`Confirm`})]})]})},w={render:()=>(0,_.jsxs)(u,{className:`w-[350px]`,children:[(0,_.jsxs)(d,{children:[(0,_.jsx)(f,{children:`Long Content Card`}),(0,_.jsx)(p,{children:`Card with longer content`})]}),(0,_.jsxs)(m,{children:[(0,_.jsx)(`p`,{className:`mb-2`,children:`This is a card with longer content to demonstrate how it handles multiple paragraphs of text.`}),(0,_.jsx)(`p`,{className:`mb-2`,children:`The card component is flexible and can accommodate various content lengths while maintaining a clean and organized appearance.`}),(0,_.jsx)(`p`,{children:`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`})]}),(0,_.jsx)(h,{children:(0,_.jsx)(s,{children:`Read More`})})]})},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <Card className="w-[350px]">\r
      <CardHeader>\r
        <CardTitle>Card Title</CardTitle>\r
        <CardDescription>Card description goes here</CardDescription>\r
      </CardHeader>\r
      <CardContent>\r
        <p>Card content goes here. This is the main body of the card.</p>\r
      </CardContent>\r
      <CardFooter>\r
        <Button>Action</Button>\r
      </CardFooter>\r
    </Card>
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <Card className="w-[350px]">\r
      <CardHeader>\r
        <CardTitle>Card Title</CardTitle>\r
        <CardDescription>Card description goes here</CardDescription>\r
      </CardHeader>\r
      <CardContent>\r
        <p>Card content goes here. This card has no footer.</p>\r
      </CardContent>\r
    </Card>
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <Card className="w-[350px]">\r
      <CardContent>\r
        <p>This card has no header, just content.</p>\r
      </CardContent>\r
      <CardFooter>\r
        <Button>Action</Button>\r
      </CardFooter>\r
    </Card>
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => <Card className="w-[350px]">\r
      <CardContent>\r
        <p>This card has only content, no header or footer.</p>\r
      </CardContent>\r
    </Card>
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: () => <Card className="w-[350px]">\r
      <CardHeader>\r
        <CardTitle>Confirm Action</CardTitle>\r
        <CardDescription>Are you sure you want to proceed?</CardDescription>\r
      </CardHeader>\r
      <CardContent>\r
        <p>This action cannot be undone.</p>\r
      </CardContent>\r
      <CardFooter className="flex justify-end gap-2">\r
        <Button variant="outline">Cancel</Button>\r
        <Button variant="destructive">Confirm</Button>\r
      </CardFooter>\r
    </Card>
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: () => <Card className="w-[350px]">\r
      <CardHeader>\r
        <CardTitle>Long Content Card</CardTitle>\r
        <CardDescription>Card with longer content</CardDescription>\r
      </CardHeader>\r
      <CardContent>\r
        <p className="mb-2">\r
          This is a card with longer content to demonstrate how it handles\r
          multiple paragraphs of text.\r
        </p>\r
        <p className="mb-2">\r
          The card component is flexible and can accommodate various content\r
          lengths while maintaining a clean and organized appearance.\r
        </p>\r
        <p>\r
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do\r
          eiusmod tempor incididunt ut labore et dolore magna aliqua.\r
        </p>\r
      </CardContent>\r
      <CardFooter>\r
        <Button>Read More</Button>\r
      </CardFooter>\r
    </Card>
}`,...w.parameters?.docs?.source}}},T=[`Default`,`WithoutFooter`,`WithoutHeader`,`ContentOnly`,`WithMultipleActions`,`LongContent`]}))();export{S as ContentOnly,y as Default,w as LongContent,C as WithMultipleActions,b as WithoutFooter,x as WithoutHeader,T as __namedExportsOrder,v as default};