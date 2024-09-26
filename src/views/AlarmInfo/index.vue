<template>
  <div class="flex-column AlarmInfo">
    <StationContext :disable-all="true" :on-change="onContextStationChange" />
    <div class="main-box">
      <div class="card left-box">
        <el-tabs type="card" class="tabs" v-model="activeTab" @tab-change="tabChange" stretch>
          <el-tab-pane label="全部报警" name="all"> </el-tab-pane>
          <el-tab-pane label="未处理报警" name="unconfirm"> </el-tab-pane>
        </el-tabs>
        <div class="all-alarms">
          <span>共计报警{{ total }}条</span>
          <div>
            <span>报警类型分析</span>
            <div>
              <ECharts v-if="option !== null" :option="option" />
              <el-empty v-else description="暂无数据" />
            </div>
          </div>
          <div>
            <span>报警等级分析</span>
            <div>
              <ECharts v-if="pieOption !== null" :option="pieOption" />
              <el-empty v-else description="暂无数据" />
            </div>
          </div>
        </div>
      </div>
      <div class="card flex-column right-box">
        <el-form :inline="true" :model="formInline" class="table-form-inline">
          <el-form-item label="确认状态">
            <el-select v-model="formInline.confirmstatus">
              <el-option label="全部" value="0" />
              <el-option label="未确认" value="1" />
              <el-option label="已确认" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker v-model="formInline.range" type="daterange" />
          </el-form-item>
          <el-form-item label="报警类型分类">
            <el-select v-model="formInline.messinfotype">
              <el-option label="全部" value="0" />
              <el-option label="通讯状态" value="2" />
              <el-option label="现场报警" value="3" />
              <el-option label="设备故障" value="4" />
            </el-select>
          </el-form-item>
          <el-form-item label="事件类型">
            <el-input v-model="formInline.alarmtype" />
          </el-form-item>
          <el-form-item label="设备名称或编号">
            <el-input v-model="formInline.metersearch" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-popconfirm confirm-button-text="是" cancel-button-text="否" title="确认所有报警?" @confirm="oneClickConfirm">
              <template #reference>
                <el-button>一键确认</el-button>
              </template>
            </el-popconfirm>
          </el-form-item>
        </el-form>
        <el-tabs type="card" class="tabs" v-model="formInline.messinfolevel" @tab-change="alarmTypeTabChange">
          <el-tab-pane label="全部" name="all"> </el-tab-pane>
          <el-tab-pane label="普通" name="1"> </el-tab-pane>
          <el-tab-pane label="严重" name="2"> </el-tab-pane>
          <el-tab-pane label="事故" name="3"> </el-tab-pane>
        </el-tabs>
        <div class="table-box">
          <PaginationTable ref="tableRef" :columns="columns" :fetch-data="fetchData">
            <!-- <template #alarmtime="{ row }">
              {{ moment(row.alarmtime).format("YYYY-MM-DD HH:mm:ss") }}
            </template> -->
            <template #messinfoleveltext="{ row }">
              <span :class="`messinfoleveltext messinfoleveltext-${row.messinfolevel}`">{{ row.messinfoleveltext }}</span>
            </template>
            <template #confirmstatus="{ row }">
              <span :class="`confirmstatus-${row.confirmstatus}`">{{ row.confirmstatus ? "已确认" : "未确认" }}</span>
            </template>
            <template #actions="{ row }">
              <el-popconfirm
                v-if="!row.confirmstatus"
                confirm-button-text="是"
                cancel-button-text="否"
                title="确认状态?"
                @confirm="confirmEvent(row)"
              >
                <template #reference>
                  <el-button type="primary" size="mini" bg text>确认报警</el-button>
                </template>
              </el-popconfirm>

              <el-popconfirm
                v-else
                confirm-button-text="是"
                cancel-button-text="否"
                title="修改为未确认?"
                @confirm="confirmEvent(row)"
              >
                <template #reference>
                  <el-button size="mini" type="danger" bg text>重新未确认报警</el-button>
                </template>
              </el-popconfirm>
              <el-button size="mini" type="primary" bg text @click="showAlarmDetail(row)">查看详情</el-button>
            </template>
          </PaginationTable>
          <el-dialog v-model="dialogDetailVisible" title="报警详情" width="620">
            <div class="alarm-detail">
              <el-descriptions :column="1">
                <el-descriptions-item>
                  <template #label>
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAMCAYAAABbayygAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACsSURBVHgBpdDRCcIwEAbg/64ZIBuIG7iBbqAiPvRJR3CEuoEb+GYr1oITiJt0A3WA3HnpgwhKEPrDhQv5cg9H1FRXDXpDIpTR2EHIs8MgBVXhnQJbFfVIy4uzcw3GJgkD7xwId8zzNgnr8sH4Mz1gfZh1lYJZc1yBaAS1iv0vGFFQGWKRF1haBevP1XsbZJc9g1qxzXfoM6eyYMcq9okJmIjo8wvF2OT4RsTTF5q9QqwEfHc7AAAAAElFTkSuQmCC"
                      class="image__inner"
                    />
                    变配电站名称
                  </template>
                  {{ alarmDetail.stationname }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEfSURBVHgBhZJBSsNAFIZfB6qtFg3YRjEgblxIvYArZ+O+Ii5cxRvoDZIcwSO4MRSt4g3ixp2SYLRbRVzEVPMiKLWJxEyk47Qa+8PAvDff/x78TAFEHR82Zkvl3dWZKsUogvZraHlR14CNbQuGRVpNbc+5SoJeLxGl314ncNJUf8HsIU+Dppa5I8KW76WAmx0bA95n2+HUpKQ+Jana8gr8pelikd8Zo4yVVbIuz9F+87zzBJbvc+jg/g6cELO7lJo3lQVK3j9jhH8kbnmLYyQXLx2731irykBrNQ405hVYnJjktR2iTdwADaN9M3I6Yy6fcf+7OjJ1lkp+rG6SpqkPjssxZXEKcGHIROuSpC1VKlQeL+HZ44PjdT902Pr5Gl9io+IcOKhyhgAAAABJRU5ErkJggg=="
                      class="image__inner"
                    />
                    设备名称
                  </template>
                  {{ alarmDetail.metername }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAFCAYAAABmWJ3mAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABQSURBVHgBdY2xEYAwDANfJgOQyRiFVViBhoqGjbwBLBCMD5o0fKf7kyT2bZFsijtWDJc0R4vDQCM9wZuNHz4hLspw9qJk1XPTodXMNciv5AHvpRddzJ+o9gAAAABJRU5ErkJggg=="
                      class="image__inner"
                    />
                    设备编号
                  </template>
                  {{ alarmDetail.meter }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAMCAYAAAC5tzfZAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAE6SURBVHgBhZGxSsNQFIb/m6RFkJLUzbpk0NXGTRCxbg5C08GhW/oG+gTSJ9A3iC4mFmNQEXSxwUmhQxdxKLRxcNAOTUAsFMv1WultaqP+0+Xwf/f85xwgTq6pwLFN/CKBm1xLHZWnlAlnpaKNQ0yEEpODhaIPgZa5yTnehdjXuXcUiQEfUAWJ5JfkGSMlScrze9dvvIU7oCTAVtFDbFY2x4HfpEN1ej1q1O4o+zAXC3x1Mmr3HPDarxwkp3Y1apVwcrQPUZDRJ2d6JjMolh8fcPjUQnNjE0oigfnplNpwLAMCWWNRvch2LMNrv9B60KHq1QVNnzs0d3sz6LZwfdkaG+NnyqysoLq6DjmZxN6iFj97XLEeBnCXV6DJ6T8gdlxBJNlhUZ+dmwQiG/y+k2Nvs1ce/ynsFlAqBZ/tcIW3wJayWwAAAABJRU5ErkJggg=="
                      class="image__inner"
                    />
                    报警类型
                  </template>
                  {{ alarmDetail.messinfotypetext }}
                </el-descriptions-item>
                <!-- <el-descriptions-item>
                  <template #label>
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAMCAYAAAC0qUeeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAC3SURBVHgBlZDLDYJQEEXvG2jACsQOXgm2gMQPK+1AO9AOtANhxccAsQIpAUuwAwqQGYkryDNBzm6Sk7l3RlERn1mgMYTgDmRRiX9oPcIIRsl2d7DyZNso9UQjDiyuITTFYh2am4tUN8IzuKsKwhquX0JkgjTVhkzMe3j+qZfrbS6g986QmSVEFh+6LmXJEZYdmDWWbSykxi2aQ1GFInIY/PrW+nVgWyNAn9488nUilcrjx5AoUNcP/0BDWvaXyZkAAAAASUVORK5CYII="
                      class="image__inner"
                    />
                    消息码
                  </template>
                  {{ alarmDetail.messinfotypetext }}
                </el-descriptions-item> -->
                <el-descriptions-item>
                  <template #label>
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEJSURBVHgBhVHLTcNAEH0zNhLhgJ0OUgId4BIwEkK5kQqgA0QHdLBwMoiPS0hKoQTnFC47k9l1NspXedIedufNvjfzCAmtKxkXj+L9EBkX8c0rgXmK2/v3RKOe3IxIyanXF9yNZ9hEqpFOUI//YgP9fkyVFjXqSRdJ3583yKQzwiypkw5anS9qxk/z0HevyAEi5ZaK1aL65fkTM9N1kMIpmFUGFbnIEYLQlflfKfTWRHXIB8lnMIJ2EIziscFTKYfKfK+ht/i2+8wZKUOpsx8qnIKpiJLNkf+/2p6f4Vx5nBzWSi4EyHFltlYqBu2m1zW+mipmEFaPlHSCZQJFFbyGq3ibL1g2FymnJYXxeNysKU16AAAAAElFTkSuQmCC"
                      class="image__inner"
                    />
                    发生时间
                  </template>
                  {{ alarmDetail.alarttime }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAMCAYAAAC0qUeeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABmSURBVHgBzZDLCYAwEERng4VoB9aiF7uyBI/mEsUKtAQ70EocA6IgIsneMpf9PWZhxIy2PYgSIRET4PoFMfKcgUIqOLsbcXbzJb8G7Kya4hdm/T3GOT/L94dEnJXRkasMdg6BhHQnfmok9ct84r8AAAAASUVORK5CYII="
                      class="image__inner"
                    />
                    参数名称
                  </template>
                  {{ alarmDetail.paramname }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAMCAYAAAC0qUeeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADTSURBVHgBtVDBDQEBEJzd3AMJrgOnAjrgShAePK8CdEAFSrgnEhwV0AE6oAISiZ9de3cR8eIe5rGbzM5OdpY4mk1EUcc3KDbAcrrDLzAdIwMyiZ240GK+19vdR7HQhKrHTGVRCQh8SfgguL6dCR67+QlEXGbUBOKj0/MUGKOUG3w4W9SrCI7E3FdS2yULH9Nijuq+xBSntGFF290qLeeR6uNsSw0onRI9y5AfOhCiupMS6qf9HiS9ZTdGoYtWeqtE4QiSW//vz4696kCr2fab0GKHT/msWslAS0NgAAAAAElFTkSuQmCC"
                      class="image__inner"
                    />
                    参数编号
                  </template>
                  {{ alarmDetail.eventname0 }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAHCAYAAADam2dgAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAClSURBVHgBbY/NCcJAEIXfjAEhF9OClWRLiCKip2gJdmAn0VMIimkhdmAJ2oEnQXD3uRs05JA9LMP7PuZHMPTOVSaCnKRgscqiDtRFIi4uRKVxwJX8PKA6CSjqC1S3I0aJT1LIew87Np30F0BNMV8efXTDqTSePgPX8FFfW8zWd1g3bTtfqry/YivBxgZ1abqUNH3ptzg3sOLnhsvKA4jE1z5rYfMF1/o3Vq6T8nkAAAAASUVORK5CYII="
                      class="image__inner"
                    />
                    当前值
                  </template>
                  {{ alarmDetail.value }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAYAAADEUlfTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACFSURBVHgBfc3LCYNQEAXQO++5yDLpIOkkJSQQkm1KsAQ70A505Qe/nWgJdqCgoMLzL/g24t3MMAznEnxHw1FGnuAstG+xeYW4qFB4AdHfULcGbSyVIMrXp88vmW9PMNylEdjGSkVuukwWurpkQ+cPxjO8vxkC74VxKCWrNNbe2YsHqk6bALufLFqyFC/0AAAAAElFTkSuQmCC"
                      class="image__inner"
                    />
                    设定值
                  </template>
                  {{ alarmDetail.limitvalue }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAMCAYAAAC0qUeeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAC4SURBVHgBjZDLDcIwEERnDYcop5RCB5SAgsTvSAd0Ah2EnIhAEFEBLiElUIJvcCBe8gEcEyIzB2ssPe3OLIk0WWvGAC4xzsBxJ/GPCq7/+aRRUBsvsKm7QrhUpTMw+yOwJgga2ut9WbyxDY9n8ctt0aFGjH1dUud2WYErwoWsbVOPPGjP66n25HCawSEDH5IVBCvxVVAzyXcfA0/mm/J8Gp60xtHtR4wqSnVPhc4YzBmdkgscYlD0BIabONL24iqNAAAAAElFTkSuQmCC"
                      class="image__inner"
                    />
                    报警详情
                  </template>
                  {{ alarmDetail.eventdescription }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAMCAYAAAC0qUeeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACeSURBVHgBjdDBDYJQEATQ2dWLN0ugBEsRPRCrUCsgVmAJxBOfxC+xAimBDrQDPXnzj594A5J1jjsv2WREa3cMxAJWiCvgywb/JDodLc7VUry798/jePJuyLC3sa9yCbOnqG5tvM4OELQkxcZ1maBbR7QwsQbJAXlhlZ1MHJ/HzTmHd7t+Nx1ipvggic3DxEg3HRrAHyZbubgbjBBSfAHUdDSHz56XewAAAABJRU5ErkJggg=="
                      class="image__inner"
                    />
                    确认状态
                  </template>
                  {{ alarmDetail.confirmstatus ? "已确认" : "未确认" }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADvSURBVHgBdZDBUcNADEW/ZBcQOggdkAqYdMDmQOAEVBA6iKkAOmA4BWcmcVJBSgh0ABWQE7fVR/aMPbYTdNmR9uvpS4JWaLGc0ZhBACE3pnxCuP1q/hvlanFvFgP195yT6ZkBn0J5xamQ9fsOxfKiV9ujWAyPyVXEQ4/heTI4EpPYiulznSfr/M6fIcL1R11LG4ZyA2Imq/zHWw+R9u2occdWTTEyo+qLW9m2L9AV+wK+9Y7C8X+iEhZFBqmazE0kQ7jpCLXI5wZ7S6iXfsZH9z5KCbnCZPrQp5VCoe7N/VdTq7XURqdGl5YYLbTt/QHwRmyWA4qOcAAAAABJRU5ErkJggg=="
                      class="image__inner"
                    />
                    确认人
                  </template>
                  {{ alarmDetail.confirmer }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAELSURBVHgBfVHBUcNADFxpeDDwMRXgDkgJoQSTR8iLuJJAB6ECw4dzhjg2FRAqCB3gEvwAJo/4hO5iTAxD7qHR3UqrXR3RIl0JUOGfQ0KVDIbR9paZJfYcJXv+zg98zE3IoMlOSWmj4c3vxm1xNCptbnZA+ckET93ipqFD82j6GvsgenOTHU5eM2MMoURpXjAYXXM2m1ipT/StUCwkoishif8azJMA87RwKedp0k6ZP0xbg9go+/t6ChyHkPq10Ru6bXhWS71G81r3fLhE4PKPkvjozFmUi8tzD2dmrBsqiBazlYi9bWUwSthGp8g9M59aix74M2YhijuaawnU5J0fLVzZjVXT+oNRXH0B1jV1zFVSTvoAAAAASUVORK5CYII="
                      class="image__inner"
                    />
                    确认时间
                  </template>
                  {{ alarmDetail.mconfirmtime }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAMCAYAAAC0qUeeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEOSURBVHgBfZHBUQJBEEX/b7hw0wwggzUC2AisxRLKG0SARKJGsHgCt0QwAzKQDFwy0IN6wf4OYK1QCH9qarpmfne97iG2ZJOsJ/drkCdw5HJ20WrNi/fCOR52JHVkX2dqtk9V8oRlpciyaM9Msid6gqT7tr5IrnIt/Q627OxXBqsrwzYWiDxUif4xa47JsLHTg1kdUsFcLqy0Pr+V6unhFvSFweqrHmCM98zAR05W5hAGITMcYTn6uPxD22BMsoheeXHXQqbaertiUBHHo9eAV91UDgHlN8EQ42KnwVU8UxgpxVRATBuPUidnaLbvcUiPw0GAmFrIaOD98xlHZdOAdG7rWXZ/P+KQSh7Gp9oPfkR7L6oEr9wAAAAASUVORK5CYII="
                      class="image__inner"
                    />
                    联系人
                  </template>
                  {{ alarmDetail.head }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAMCAYAAAC5tzfZAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAE2SURBVHgBhVHdTQJhENz5jsT4JB0cdqAVKBXIEaLiC3cVSAdgB1DByYv86HlSAdoBVKAlnJogD/CNe6cSSfTYhy/fbHYys7MQLROPLmltM/3z7eNQgiCRnDIZgfRpWKZlD3u7sWwrRINnifulNb4fTBQf5yoJUJRk8WXnVoetYho3V0jubjpKTJR+DWJCQVuqZ718JQcdAA1ZfHde52PZUsjeaNCE4IjCJ1Vr8H1eXicYjw5ktSxJ7eJhk5R+omEMI1O7tCpsTuhYL+sTsaY6g4FLMBCv/mJ+SDTzQKOvmIIhYbs6HMLqjuRYanWflHGKJQyL2DAbh0VZ7bQBx9Vjd6XgJOKdTn+7UXIPf24a9X312ALl0RpeZZaiYUvt+aye7+PfiNKDW1TUuA8xLsXOxCwq4gXJJx2Tjxu5rJg+AAAAAElFTkSuQmCC"
                      class="image__inner"
                    />
                    联系电话
                  </template>
                  {{ alarmDetail.telephone }}
                </el-descriptions-item>
              </el-descriptions>
              <div class="quick-action">
                <span>快速定位</span>
                <div>
                  <el-button type="primary" @click="router.push('/DistributDiagram')">配电图</el-button>
                  <el-button type="primary" @click="router.push('/ElectricData')">电力数据</el-button>
                  <el-button type="primary" @click="router.push('/EnergyData')">用能报表</el-button>
                  <el-button type="primary" @click="router.push('/HarmonicData')">谐波监测</el-button>
                  <el-button type="primary" @click="router.push('/EnergyYOY')">同比分析</el-button>
                </div>
              </div>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx" name="AlarmInfo">
import { ref, reactive, onMounted } from "vue";
import moment from "moment";
import { ReqPage } from "@/api/interface/index";
import {
  getAlarmEventLogList,
  getUnConfirmedEventsByCache,
  setAlarmEventConfirmed,
  setAlarmEventUnConfirmed,
  oneClickConfirmAlarmEvents
} from "@/api/modules/main";
import PaginationTable from "@/components/PaginationTable/index.vue";
import ECharts from "@/components/Charts/echarts.vue";
import { ElMessage } from "element-plus";
import * as echarts from "echarts/core";
import StationContext from "@/components/StationContext/index.vue";
import { getContextStationId } from "@/utils";
import { useRouter } from "vue-router";

const end = new Date();
const start = new Date();
start.setTime(start.getTime() - 3600 * 1000 * 24);
const router = useRouter();

const formInline = reactive<{
  messinfolevel?: "all" | "1" | "2" | "3";
  range: any[];
  metersearch?: string;
  alarmtype?: string;
  messinfotype?: "2" | "3" | "4" | "0";
  confirmstatus?: "0" | "1" | "2";
}>({
  range: [moment(start).format("YYYY-MM-DD"), moment(end).format("YYYY-MM-DD")],
  confirmstatus: "0",
  messinfotype: "0",
  messinfolevel: "all"
});

const tableRef = ref<any>(null);
const alarmDetail = ref<any>({});
const dialogDetailVisible = ref(false);
const option = ref<any>(null);
const activeTab = ref<"all" | "unconfirm">("all");
// const activeAlarmTypeTab = ref<"all" | "1" | "2" | "3">("all");
const total = ref<number>(0);
const pieOption = ref<any>(null);

const columns = [
  { prop: "stationname", label: "变配电站名称" },
  { prop: "metername", label: "设备名称" },
  { prop: "messinfotypetext", label: "报警类型分类", width: 124 },
  { prop: "alarmtype", label: "事件类型", width: 124 },
  { prop: "customDom", slotName: "alarmtime", label: "发生时间", width: 184 },
  { prop: "eventdescription", label: "报警描述" },
  { prop: "customDom", slotName: "messinfoleveltext", label: "报警等级", width: 94 },
  { prop: "customDom", slotName: "confirmstatus", label: "确认状态", width: 84 },
  { prop: "customDom", slotName: "actions", label: "操作", width: 224 }
];

const onContextStationChange = async () => {
  tableRef?.value?.resetData();
};

const showAlarmDetail = alarm => {
  dialogDetailVisible.value = true;
  alarmDetail.value = alarm;
};

const fetchData = async ({ pageSize, pageNum }: ReqPage): Promise<any> => {
  return new Promise(async resolve => {
    const params: any = {
      pageNum,
      pageSize,
      starttime: moment(formInline.range[0]).format("YYYY-MM-DD"),
      endtime: moment(formInline.range[1]).format("YYYY-MM-DD"),
      alarmtype: formInline.alarmtype,
      confirmstatus: formInline.confirmstatus,
      metersearch: formInline.metersearch,
      messinfotype: formInline.messinfotype
    };

    if (getContextStationId()) params.stationid = getContextStationId();

    if (formInline.messinfolevel !== "all") {
      params.messinfolevel = formInline.messinfolevel;
    }

    const { data } = await getAlarmEventLogList(params);
    if (!data) {
      resolve({ list: [], total: 0 });
    } else {
      resolve({ list: data.list, total: data.total });
    }
  });
};

onMounted(() => {
  GetUnConfirmedEventsByCache();
});

const GetUnConfirmedEventsByCache = async () => {
  const { numsByType, numsByLevel }: any = await getUnConfirmedEventsByCache();
  if (activeTab.value === "all")
    total.value = numsByType.reduce(function (acc, obj) {
      return acc + obj.eventcount;
    }, 0);
  else
    total.value = numsByType.reduce(function (acc, obj) {
      return acc + obj.unconfirmcount;
    }, 0);

  pieOption.value = {
    tooltip: {
      trigger: "item"
    },
    legend: {
      bottom: "0%",
      left: "20%",

      align: "left",
      textStyle: {
        fontSize: 12,
        color: "#a1a1a1",
        fontWeight: 400
      }
    },
    series: [
      {
        type: "pie",
        radius: "40%",
        silent: true,
        clockwise: true,
        data: numsByLevel.map(({ eventname, eventcount, unconfirmcount }) => ({
          value: activeTab.value === "all" ? eventcount : unconfirmcount,
          name: eventname
        })),

        label: {
          position: "outer",
          show: true,
          fontSize: 12,
          alignTo: "labelLine",
          bleedMargin: 0
        }
      }
    ]
  };
  option.value = {
    radar: {
      radius: 80,
      indicator: numsByType.map(({ eventname }) => ({ name: eventname }))
    },
    series: [
      {
        type: "radar",
        areaStyle: {
          color: new echarts.graphic.RadialGradient(0.1, 0.6, 1, [
            {
              color: "rgba(255, 145, 124, 0.1)",
              offset: 0
            },
            {
              color: "rgba(255, 145, 124, 0.9)",
              offset: 1
            }
          ])
        },
        data: [
          {
            value: numsByType.map(({ eventcount, unconfirmcount }) => (activeTab.value === "all" ? eventcount : unconfirmcount)),
            lineStyle: {
              type: "dashed",
              color: "#1677ff"
            },
            symbol: "rect"
          }
        ]
      }
    ]
  };
};

const tabChange = () => {
  GetUnConfirmedEventsByCache();
};

const alarmTypeTabChange = value => {
  formInline.messinfolevel = value;
  tableRef?.value?.resetData();
};

const onSubmit = () => {
  tableRef?.value?.resetData();
};

const confirmEvent = async row => {
  if (row.confirmstatus) {
    const { code, msg } = await setAlarmEventUnConfirmed({ alarmeventlogid: row.alarmeventlogid });
    if (code) {
      ElMessage.success(msg);
      tableRef?.value?.resetData();
    } else {
      ElMessage.error(msg);
    }
  } else {
    const { code, msg } = await setAlarmEventConfirmed({ alarmeventlogid: row.alarmeventlogid });
    if (code) {
      ElMessage.success(msg);
      tableRef?.value?.resetData();
    } else {
      ElMessage.error(msg);
    }
  }
};

const oneClickConfirm = async () => {
  const { code, msg } = await oneClickConfirmAlarmEvents();
  if (code) {
    ElMessage.success(msg);
    tableRef?.value?.resetData();
  } else {
    ElMessage.error(msg);
  }
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
