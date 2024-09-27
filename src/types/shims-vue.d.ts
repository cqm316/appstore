// declare module '*.vue' {
//   import { DefineComponent } from 'vue';
//   const component: DefineComponent<{}, {}, any>;
//   export default component;
// }

declare module "*.vue" {
  import { defineComponent } from "vue";
  const component: ReturnType<typeof defineComponent>;
  export default component;
}