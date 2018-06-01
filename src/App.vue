<template>
  <div class="title">
    {{msg}}
    <Home/>
  </div>

</template>


<script>

export default {
  name: "app",
  components: {
  },
  data() {
    return {
      msg: "my app"
    };
  }
};
</script>
