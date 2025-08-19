<template>
  <table class="custom-table">
    <tr>
      <td><div class="option">圣杯战争</div></td>
      <td><div class="option">魔法与魔术</div></td>
      <td><div class="option">圣堂教会</div></td>
      <td><div class="option">魔术协会</div></td>
    </tr>
    <tr>
      <td><div class="option">根源</div></td>
      <td><div class="option">从者</div></td>
      <td><div class="option">冬木“御三家”</div></td>
      <td><div class="option">抑制力</div></td>
    </tr>
  </table>
</template>
<script setup lang="ts">
// import router from "@/router";

</script>

<style>
.table-container {
  width: 900px;
  max-width: 100%;
  height: 300px;
  margin: 0 auto;
  padding: 0 10px;
}

.custom-table {
  width: 80%;
  height: 50%;
  border-collapse: collapse;
  margin: 0 auto;
}

.custom-table td {
  text-align: center;
  vertical-align: middle;
  border: none;
  padding: 5px;
  height: 100px ;
}

.option {
  background-image: url('/xuanxiang.png');
  width: 200px;
  max-width: 100%;
  height: 100px;
  background-size: cover;
  background-repeat: no-repeat;
  text-align: center;
  line-height: 110px;
  font-size: 25px;
  font-weight: bold;
  text-shadow:
      1px 1px 0 #ccc,
      2px 2px 0 #c9c9c9,
      3px 3px 0 #bbb,
      4px 4px 0 #b9b9b9,
      5px 5px 0 #aaa,
      10px 10px 15px rgba(0, 0, 0, 0.3);
  margin: 0 auto;
}

.custom-table a {
  text-decoration: none;
  color: inherit;
}
</style>