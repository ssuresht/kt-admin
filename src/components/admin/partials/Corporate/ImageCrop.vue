<template>
  <v-dialog v-model="dialog" width="700">
    <v-card>
      <v-card-title>
        画像の切り取り
      </v-card-title>
      <div
        class="full-width full-height d-flex align-center justify-center"
        v-if="croppedImage"
      >
        <img :src="croppedImage" />
      </div>
      <VueCropper
        v-else
        ref="cropper"
        :aspect-ratio="1 / 1"
        :src="imageSrc"
        @crop="cropSize"
        :cropBoxResizable="false"
        @ready="fixCropBoxSize"
      ></VueCropper>
      <v-card-title>
        画像サイズ
      </v-card-title>
      <v-card-subtitle>
        <div class="d-flex align-center justify-space-between">
          <div class="">
            {{ imageSize.width }}px X {{ imageSize.height }}px
          </div>
          <v-icon color="green" v-if="imageSizeCheck">mdi-done</v-icon>
          <v-icon v-else color="red">mdi-cancel</v-icon>
        </div>
      </v-card-subtitle>
      <v-card-actions>
        <template v-if="croppedImage">
          <v-btn color="primary" @click="croppedImage = null"
            >やり直す</v-btn
          >
          <v-btn
            color="primary"
            :disabled="imageSizeCheck ? false : true"
            @click="cropImageSuccess"
            >OK</v-btn
          >
          <v-btn color="primary" @click="$emit('crop-image-cancel')"
            >キャンセル</v-btn
          >
        </template>
        <template v-else>
          <v-btn
            @click="cropImage"
            :disabled="imageSizeCheck ? false : true"
            color="primary"
            >作成</v-btn
          >
          <v-btn class="cancel-button" @click="$emit('crop-image-cancel')"
            >キャンセル</v-btn
          >
        </template>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'
export default {
  props: {
    imageSrc: {
      required: true
    }
  },
  components: {
    VueCropper
  },
  data() {
    return {
      dialog: true,
      imageSize: {
        width: 0,
        height: 0
      },
      croppedImage: null
    }
  },
  computed: {
    imageSizeCheck() {
      return this.imageSize.width > 256 && this.imageSize.height > 256
    }
  },
  methods: {
    cropSize({ detail }) {
      this.imageSize.width = parseInt(detail.width)
      this.imageSize.height = parseInt(detail.height)
    },
    fixCropBoxSize() {
      this.$refs.cropper.setCropBoxData({
        width: 256,
        height: 256,
        left: 0,
        top: 0
      })
    },
    cropImage() {
      this.croppedImage = this.$refs.cropper
        .getCroppedCanvas({ width: 256, height: 256 })
        .toDataURL()
    },
    cropImageSuccess() {
      this.$emit('image-crop-success', this.croppedImage)
    }
  }
}
</script>
