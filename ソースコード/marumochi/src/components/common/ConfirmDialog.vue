<template>
  <v-dialog v-model="model" max-width="350">
    <v-card>
      <v-card-title>
        {{ title }}
      </v-card-title>

      <v-card-text>
        {{ message }}
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn text @click="cancel"> キャンセル </v-btn>

        <v-btn color="primary" @click="ok"> OK </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
const model = defineModel();

const emit = defineEmits(["ok", "cancel"]);

defineProps({
  title: String,

  message: String,
});

function ok() {
  emit("ok");

  model.value = false;
}

function cancel() {
  emit("cancel");

  model.value = false;
}
</script>
