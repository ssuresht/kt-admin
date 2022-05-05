<template>
  <div :style="cssVars">
    <vue-editor
      :style="cssVars"
      ref="quillEditor"
      :customModules="customModulesForEditor"
      :editorOptions="editorSettings"
      :editorToolbar="customToolbar"
      v-model="_text"
    >
    </vue-editor>
  </div>
</template>

<script>
import { VueEditor } from 'vue2-editor'
import ImageResize from 'quill-image-resize-module'
export default {
  name: 'PostEditor',
  components: { VueEditor },
  props: {
    data: {
      type: String,
      default: '',
      required: true
    },
    height: {
      type: String,
      default: '400px'
    }
  },
  computed: {
    cssVars() {
      return {
        /* variables you want to pass to css */
        'min-height': this.height
      }
    },
    _text: {
      get: function() {
        return this.data
      },
      set: function(newValue) {
        return this.$emit('update:data', newValue)
      }
    }
  },
  data() {
    return {
      customModulesForEditor: [{ alias: 'imageResize', module: ImageResize }],
      editorSettings: {
        modules: {
          imageResize: {}
        }
      },
      customToolbar: [
        ['bold', 'underline'],
        [{ header: 1 }],
        [{ header: 2 }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
        ['link', 'image', 'video']
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
.ql-container,
.ql-editor {
  min-height: inherit !important;
}
::v-deep {
  .ql-container,
  .ql-editor {
    min-height: inherit !important;
  }
}
</style>
