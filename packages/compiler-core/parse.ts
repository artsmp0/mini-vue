export const baseParse = (content: string) => {
  // 匹配整个HTML标签
  // <(\w+)       捕获标签名,如<p>中的p
  // \s+          匹配一个或多个空白字符
  // ([^>]*)      捕获标签属性,如class="hello"
  // >            匹配>字符
  // ([^<]*)      捕获标签内容,如Hello World
  // <\/\1>       匹配结束标签,\1是一个反向引用,引用之前捕获的标签名
  const matched = content.match(/<(\w+)\s+([^>]*)>([^<]*)<\/\1>/);

  // 如果没有匹配到,返回默认值
  if (!matched) return { tag: "", props: {}, textContent: "" };

  // 解构赋值,获取标签名、属性和文本内容
  const [_, tag, attrs, textContent] = matched;
  console.log("attrs: ", attrs);

  // 创建一个对象,用于存储属性
  const props: Record<string, string> = {};

  // 匹配属性
  // (\w+)        捕获属性名,如class
  // =            匹配=字符
  // ["']         匹配单引号或双引号
  // ([^"']*)     捕获属性值,如hello
  // ["']         匹配单引号或双引号
  // /g           全局匹配模式
  attrs.replace(/(\w+)=["']([^"']*)["']/g, (_, key, value) => {
    // 将属性名和属性值存储在props对象中
    props[key] = value;
    // 返回空字符串,以确保replace不会修改原始字符串
    return "";
  });

  // 返回解析结果
  return { tag, props, textContent };
};
