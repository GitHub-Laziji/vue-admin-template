<template>
  <div style="height:100%;">
    <general-table :list="list" :columns="columns"></general-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      columns: [
        {
          title: "ID",
          name: "id",
          table: {
            width: 100,
            render: record =>
              function(h) {
                return h("h1", record.id);
              }
          }
        },
        {
          title: "CC2",
          name: "c2",
          query: {
            type: "select"
          },
          table: {
            type: "select"
          },
          valueMapping: () => {
            return new Promise((resolve, reject) => {
              resolve([{ key: 1123, value: "666" }]);
            });
          }
        }
      ]
    };
  },
  methods: {
    list(params, page, limit) {
      return new Promise((resolve, reject) => {
        let list = [];
        for (let i = 0; i < 10; i++) {
          list.push({
            id: 1,
            c2: 1123,
            c3: "!23123"
          });
        }
        resolve({
          total: list.length,
          records: list
        });
      });
    }
  }
};
</script>

<style>
</style>
