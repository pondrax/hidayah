<script lang="ts">
  const back = ()=>{
    history.back()
  }
</script>

<div>
  <slot />
  
  <div class="btm-nav">
    <a href="#/setting" aria-label="Bookmark">
      <i class="ri-bookmark-line" /> 
    </a>
    <a href="#/list" class="active" aria-label="List">
      <i class="ri-list-check" />
    </a>
    <!-- svelte-ignore a11y-invalid-attribute -->
    <a href="#" on:click={back} aria-label="Back">
      <i class="ri-arrow-left-line" /> 
    </a>
  </div>
</div>
