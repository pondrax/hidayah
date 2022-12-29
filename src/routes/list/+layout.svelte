<script lang="ts">
  const back = ()=>{
    history.back()
  }
</script>

<div>
  <slot />
  
  <div class="btm-nav">
    <a href="#/setting">
      <i class="ri-bookmark-line" /> 
    </a>
    <a href="#/list" class="active">
      <i class="ri-list-check" />
    </a>
    <!-- svelte-ignore a11y-invalid-attribute -->
    <a href="#" on:click={back}>
      <i class="ri-arrow-left-line" /> 
    </a>
  </div>
</div>
