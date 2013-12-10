#!/usr/bin/ruby
#coding: utf-8 
#BASE_DIR="/Library/Ruby/Gems/1.8/gems"
BASE_DIR="/usr/local/lib/ruby/gems/1.8/gems"
$: << "#{BASE_DIR}/prawn-1.0.0.rc1/lib" << "#{BASE_DIR}/ttfunk-1.0.3/lib" << "#{BASE_DIR}/pdf-reader-1.2.0/lib" << "#{BASE_DIR}/Ascii85-1.0.2/lib"  << "#{BASE_DIR}/hashery-2.0.1/lib" << "#{BASE_DIR}/ruby-rc4-0.1.5/lib" << "#{BASE_DIR}/pg-0.12.2/lib"
$: << "#{BASE_DIR}/bundler-1.2.1/lib" << "#{BASE_DIR}/rubygems-update-1.8.24/lib"

require 'rubygems'
require 'bundler'

require 'prawn'
require 'prawn/security'
require "prawn/layout"

require 'pg'
$conn = PGconn.open(:dbname=>'CS1204', :user=>'postgres', :password=>'brightechs', :host=>'localhost', :port=>'5432')
$conn.exec("set standard_conforming_strings = off")

JDDH = {"虞山镇"=>"52020913","海虞镇"=>"52560729,52560728,52560725","碧溪镇"=>"52293449","梅李镇"=>"52261966","辛庄镇"=>"52487020","古里镇"=>"52536922","支塘镇"=>"52511385","沙家浜镇"=>"52195712","董浜镇"=>"52684491","尚湖镇"=>"52418397","经济开发区"=>"52699829","东南开发区"=>"52579929","度假区"=>"51532293"}


def gen_pdf(plan_id)
  
  dateStr = Time.now.strftime("%Y年%m月%d日")
  puts dateStr
  
  #dybt = $conn.exec("select s_value from gysz where s_key='打印标题';")[0]['s_value']
  user = $conn.exec("select * from ydb where id = #{plan_id};")[0]
  dd=user
  
  dybt = "建 设 用 地 许 可 证"
  yddw = dd['srf']    || ""
  xmmc = dd['jsxmmc'] || ""
  pzwh = dd['pfwh']   || ""
  gdfs = dd['gdfs']   || ""
  ydmj = dd['zdmj']   || ""
  tdyt = dd['tdyt']   || ""
  jsgq = dd['jsgq']   || ""
  tdzl = dd['dkwz']   || ""
  
  dz   = dd['dkdz']   || ""
  xz   = dd['dkxz']   || ""
  nz   = dd['dknz']   || ""
  bz   = dd['dkbz']   || ""

  cx   = dd['cx']     || ""
  jbdh = JDDH[cx] || "0512-8888888"
  
  #puts ("#{dybt}, #{yddw}, #{xmmc}, #{pzwh}, #{gdfs}, #{ydmj}, #{tdyt}, #{jsgq}")
  
  xmfzr = dd['lxr']   || ""
  lxdh =  dd['dh']   || ""
  
  gldw =  "常数市国土资源局 #{cx} 分局"
  
  pdf_url = "./dady/yd_xkz/jsyd_#{plan_id}.pdf"
  
  imgs = $conn.exec("select id, yxmc, rq, tpjd, bz from gh_image where ydb_id = #{plan_id}")
  
  if imgs.count > 0 
    img_path = "./dady/ghtx/#{imgs[0]['yxmc']}"
  else 
    img_path = "./public/img/upload_photo_first.png"
  end    
  puts img_path
  
  Prawn::Document.generate("#{pdf_url}") do 
    self.font_size = 12
    move_down 20
  
    font "#{Prawn::BASEDIR}/data/fonts/simhei.ttf"
    text "#{dybt}", :align => :center, :size => 18
    move_down 20
      table([["<font size='14'>用地单位</font>", "#{yddw}"],
             ["<font size='14'>项目名称</font>", "#{xmmc}"]], 
             :position => :center, :width => 520, :column_widths => [90, 430], :cell_style => {:padding => [15,0,15,15],:inline_format => true})
      table([["<font size='14'>批准文号</font>", "#{pzwh}",  "<font size='14'>供地方式</font>", "#{gdfs}"],
             ["<font size='14'>用地面积</font>", "#{ydmj}  平方米",  "<font size='14'>土地用途</font>", "#{tdyt}"]], 
             :position => :center, :width => 520, :column_widths => [90, 200, 90, 140], :cell_style => {:padding => [15,0,15,15],:inline_format => true})
      table([["<font size='14'>建设工期</font>", "#{jsgq}"]], 
            :position => :center, :width => 520, :column_widths => [90, 430], :cell_style => {:padding => [15,0,15,15],:inline_format => true}) 
      table([["<font size='14'>土地坐落</font>", "#{tdzl}"]], 
            :position => :center, :width => 520, :column_widths => [90, 430], :cell_style => {:padding => [15,0,15,15],:inline_format => true}) 
      table([
          [{:content => "<font size='14'>　四\n\n　址\n\n　位\n\n　置</font>", :rowspan => 4, :valign => :center,:inline_format => true}, "东：#{dz}", {:image => img_path, :fit => [220, 220], :rowspan => 4}],
          ["南：#{nz}"],
          ["西：#{xz}"],
          ["北：#{bz}"]],
          :position => :center, :width => 520, :column_widths => [90, 200, 230], :cell_style => {:padding => [15,0,15,15]})
      table([["<font size='14'>用地单位\n项目负责人</font>", "#{xmfzr}",  "<font size='14'>联系电话</font>", "#{lxdh}"],
             ["<font size='14'>跟踪管理\n单　　位</font>", "#{gldw}",  "<font size='14'>举报电话</font>", "#{jbdh}"]], 
             :position => :center, :width => 520, :column_widths => [90, 200, 50, 180], :cell_style => {:padding => [15,0,15,15],:valign => :center,:inline_format => true})
          
          
  end

end

gen_pdf(ARGV[0])

$conn.close