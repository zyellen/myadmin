<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">
      {{ $t("permission.addRole") }}
    </el-button>

    <el-table
      :data="rolesList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      :show-header="true"

      style="width: 100%; margin-top: 30px"
      border
    >
      <el-table-column align="center" label="id" width="220">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名" width="220">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="密码" width="220">
        <template slot-scope="scope">
          {{ scope.row.password }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="是否管理员" width="220">
        <template slot-scope="scope">
          {{ scope.row.isAdmin?'否':'是' }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="Operations">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">
            {{ $t("permission.editPermission") }}
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">
            {{ $t("permission.delete") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="rolesList.length"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType === 'edit' ? '编辑角色' : '新增角色'"
    >
      <el-form :rules="addRules" :model="role" label-width="80px" label-position="left">
        <el-form-item label="用户名">
          <el-input v-model="role.username" mixlength="1" placeholder="用户名" />
        </el-form-item>
        <el-form-item label="用户密码">
          <el-input v-model="role.password" mixlength="1" placeholder="用户密码" />
        </el-form-item>
        <el-form-item
          label="用户权限"
          prop="isAdmin"
        >
          <el-input
            ref="isAdmin"
            v-model="role.isAdmin"
            maxlength="1"
            placeholder="用户权限(0为普通用户，1为管理员)"
          />
        </el-form-item>
        <!-- <el-form-item label="用户密码">
          <el-input
            v-model="role.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="Role Description"
          />
        </el-form-item> -->
        <!-- <el-form-item label="Menus">
          <el-tree ref="tree" :check-strictly="checkStrictly" :data="routesData" :props="defaultProps" show-checkbox node-key="path" class="permission-tree" />
        </el-form-item> -->
      </el-form>
      <div style="text-align: right">
        <el-button type="danger" @click="dialogVisible = false">
          {{ $t("permission.cancel") }}
        </el-button>
        <el-button type="primary" @click="confirmRole">
          {{ $t("permission.confirm") }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import {
  getRoutes,
  addUser,
  findAll,
  addRole,
  deleteRole,
  updateRole
} from '@/api/role'
import i18n from '@/lang'

const defaultRole = {
  // key: '',
  username: '',
  password: '',
  isAdmin: ''
}

export default {
  data() {
    var checkeIsAdmin = (rule, value, callback) => {
      console.log('1212', value)
      if (!value) {
        return callback(new Error('权限不能为空'))
      } else if (value == 0 || value == 1) {
        return callback()
      } else {
        // this.yesIsadmin=true
        return callback(new Error('必须为0或者1'))
        // console.log('sssss',this.yesIsadmin)
      }
      // setTimeout(() => {
      //   if (!Number.isInteger(value)) {
      //     callback(new Error('请输入数字值'));
      //   } else {
      //     if (value!=0||value!=0) {
      //       callback(new Error('必须为0或者1'));
      //     } else {
      //       callback();
      //     }
      //   }
      // }, 500);
    }

    return {
      role: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      currentPage: 1,
      // 每页多少条
      pageSize: 10,
      addRules: {
        isAdmin: [{ required: true, trigger: 'blur', validator: checkeIsAdmin }]
        // password: [{ required: false, trigger: 'blur', validator: validatePassword }]
      }

    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    // Mock: get all routes and roles list from server
    // this.getRoutes()
    this.getRoles()
  },
  methods: {

    // 每页多少条
    handleSizeChange(val) {
      this.pageSize = val
    },
    // 当前页
    handleCurrentChange(val) {
      this.currentPage = val
    },

    async getRoutes() {
      const res = await getRoutes()
      this.serviceRoutes = res.data
      const routes = this.generateRoutes(res.data)
      this.routes = this.i18n(routes)
    },
    async getRoles() {
      findAll()
        .then((res) => {
          this.rolesList = res.data
          console.log(res)
        })
        .catch((e) => {
          console.log(e)
        })
    },
    i18n(routes) {
      const app = routes.map((route) => {
        route.title = i18n.t(`route.${route.title}`)
        if (route.children) {
          route.children = this.i18n(route.children)
        }
        return route
      })
      return app
    },
    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes(routes, basePath = '/') {
      const res = []

      for (let route of routes) {
        // skip some route
        if (route.hidden) {
          continue
        }

        const onlyOneShowingChild = this.onlyOneShowingChild(
          route.children,
          route
        )

        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }

        const data = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title
        }

        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    },
    generateArr(routes) {
      let data = []
      routes.forEach((route) => {
        data.push(route)
        if (route.children) {
          const temp = this.generateArr(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },
    handleAddRole() {
      this.role = Object.assign({}, defaultRole)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.role = deepClone(scope.row)
      // this.$nextTick(() => {
      //   const routes = this.generateRoutes(this.role.routes);
      //   this.$refs.tree.setCheckedNodes(this.generateArr(routes));
      //   // set checked state of a node not affects its father and child nodes
      //   this.checkStrictly = false;
      // });
    },
    handleDelete({ $index, row }) {
      this.$confirm('是否要删除该用户?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          console.log('传过去的id', row.id)
          await deleteRole({ id: row.id })
            .then((res) => {
              console.log(res)
            })
            .catch((e) => {
              console.log(e)
            })

          this.rolesList.splice($index, 1)
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
        })
        .catch((err) => {
          console.error(err)
        })
    },
    generateTree(routes, basePath = '/', checkedKeys) {
      const res = []

      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)

        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(
            route.children,
            routePath,
            checkedKeys
          )
        }

        if (
          checkedKeys.includes(routePath) ||
          (route.children && route.children.length >= 1)
        ) {
          res.push(route)
        }
      }
      return res
    },
    async confirmRole() {
      console.log('this', this.yesIsadmin)

      //  if(this.yesIsadmin){
      if (this.dialogType == 'new') {
        addUser(this.role)
          .then((res) => {
            if (res.code == 20000) {
              this.getRoles()
              this.dialogVisible = false
              this.$notify({
                title: 'Success',
                dangerouslyUseHTMLString: true,
                message: '新增用户成功',
                type: 'success'
              })
            }
          })
          .catch((e) => {
            console.log(e)
          })
      } else {
        updateRole(this.role)
          .then((res) => {
            if (res.code == 20000) {
              this.getRoles()
              this.dialogVisible = false
              this.$notify({
                title: 'Success',
                dangerouslyUseHTMLString: true,
                message: '修改用户信息成功',
                type: 'success'
              })
            }
          })
          .catch((e) => {
            console.log(e)
          })
      }
      //  }else{
      //  this.$notify({
      //       title: "添加失败",
      //       dangerouslyUseHTMLString: true,
      //       message: "新增用户失败",
      //       type: "error",
      //     });

      //  }
      //

      // const isEdit = this.dialogType === 'edit'

      // const checkedKeys = this.$refs.tree.getCheckedKeys()
      // this.role.routes = this.generateTree(deepClone(this.serviceRoutes), '/', checkedKeys)

      // if (isEdit) {
      //   await updateRole(this.role.key, this.role)
      //   for (let index = 0; index < this.rolesList.length; index++) {
      //     if (this.rolesList[index].key === this.role.key) {
      //       this.rolesList.splice(index, 1, Object.assign({}, this.role))
      //       break
      //     }
      //   }
      // } else {
      //   const { data } = await addRole(this.role)
      //   this.role.key = data.key
      //   this.rolesList.push(this.role)
      // }

      // const { description, key, name } = this.role
      // this.dialogVisible = false
      // this.$notify({
      //   title: 'Success',
      //   dangerouslyUseHTMLString: true,
      //   message: `
      //       <div>Role Key: ${key}</div>
      //       <div>Role Name: ${name}</div>
      //       <div>Description: ${description}</div>
      //     `,
      //   type: 'success'
      // })
    },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter((item) => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;

  }
  .permission-tree {
    margin-bottom: 30px;
  }
  .pagination{
    margin-top: 50px;
    text-align: center;
  }
}
</style>
