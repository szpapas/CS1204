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

JDDH = {"虞山镇"=>"48020913","海虞镇"=>"52560729,52560728,52560725","碧溪镇"=>"52293449","梅李镇"=>"52261966","辛庄镇"=>"52487020","古里镇"=>"52536922","支塘镇"=>"52511385","沙家浜镇"=>"52195712","董浜镇"=>"52684491","尚湖镇"=>"52418397","经济开发区"=>"52699829","东南开发区"=>"52579929","度假区"=>"51532293"}

#2383.94 x 3370.39

def gen_pdf(plan_id)
  
  dateStr = Time.now.strftime("%Y年%m月%d日")
  puts dateStr
  
  #dybt = $conn.exec("select s_value from gysz where s_key='打印标题';")[0]['s_value']
  user = $conn.exec("select *, ydjgsj - sjjdsj as jsgq from ydbs where id = #{plan_id};")[0]
  dd=user
  
  dybt = "建 设 用 地 许 可 证"
  yddw = dd['srf']    || ""
  xmmc = dd['jsxmmc'] || ""
  pzwh = dd['pfwh']   || ""
  gdfs = dd['gdfs']   || ""
  ydmj = dd['zdmj']   || ""
  tdyt = dd['yt']     || ""
  jsgq = dd['jsgq']   || ""
  tdzl = dd['dkwz']   || ""
  dz   = dd['dkdz']   || ""
  xz   = dd['dkxz']   || ""
  nz   = dd['dknz']   || ""
  bz   = dd['dkbz']   || ""
  sjjdsj = dd['sjjdsj'].gsub("00:00:00","") || ""
  ydjgsj = dd ['ydjgsj'].gsub("00:00:00","") || ""

  cx   = dd['cx']     || ""
  jbdh = JDDH[cx] || "0512-8888888"
  
  #puts ("#{dybt}, #{yddw}, #{xmmc}, #{pzwh}, #{gdfs}, #{ydmj}, #{tdyt}, #{jsgq}")
  
  xmfzr = dd['lxr']   || ""
  lxdh =  dd['dh']   || ""
  
  gldw =  "常数市国土资源局 #{cx} 分局"
  
  pdf_url = "./dady/yd_xkz/jsyd_#{plan_id}_big.pdf"
  
  imgs = $conn.exec("select id, yxmc, rq, tpjd, bz from gh_image where ydb_id = #{plan_id}")
  
  if imgs.count > 0 
    img_path = "./dady/ghtx/#{imgs[0]['yxmc']}"
  else 
    img_path = "./public/img/upload_photo_first.png"
  end    
  puts img_path
  
  fa = 8;
  
  Prawn::Document.generate("#{pdf_url}",{:page_size => "4A0" }) do 
    self.font_size = 16*fa
    move_down 40*fa
  
    font "#{Prawn::BASEDIR}/data/fonts/simhei.ttf"
    text "#{dybt}", :align => :center, :size => 18*fa
    move_down 20*fa
      table([["<font size='112'>用地单位</font>", "#{yddw}"],
             ["<font size='112'>项目名称</font>", "#{xmmc}"]], 
             :position => :center, :width => 480*fa, :column_widths => [90*fa, 390*fa], :cell_style => {:padding => [15*fa,0,15*fa,15*fa],:inline_format => true})
      table([["<font size='112'>批准文号</font>", "#{pzwh}",  "<font size='112'>供地方式</font>", "#{gdfs}"],
             ["<font size='112'>用地面积</font>", "#{ydmj}  平方米",  "<font size='112'>土地用途</font>", "#{tdyt}"],
             ["<font size='112'>交地时间</font>", "#{sjjdsj}",  "<font size='112'>竣工时间</font>", "#{ydjgsj}"]], 
             :position => :center, :width => 480*fa, :column_widths => [90*fa, 160*fa, 90*fa, 140*fa], :cell_style => {:padding => [15*fa,0,15*fa,15*fa],:inline_format => true})

      table([["<font size='112'>建设工期</font>", "#{jsgq.gsub('days','')} 天"]], 
            :position => :center, :width => 480*fa, :column_widths => [90*fa, 390*fa], :cell_style => {:padding => [15*fa,0,15*fa,15*fa],:inline_format => true}) 
      table([["<font size='112'>土地坐落</font>", "#{tdzl}"]], 
            :position => :center, :width => 480*fa, :column_widths => [90*fa, 390*fa], :cell_style => {:padding => [15*fa,0,15*fa,15*fa],:inline_format => true}) 
      table([
          [{:content => "<font size='112'>　四\n\n　址\n\n　位\n\n　置</font>", :rowspan => 4, :valign => :center,:inline_format => true}, "东：#{dz}", {:image => img_path, :fit => [220*fa, 220*fa], :rowspan => 4}],
          ["南：#{nz}"],
          ["西：#{xz}"],
          ["北：#{bz}"]],
          :position => :center, :width => 480*fa, :column_widths => [90*fa, 140*fa, 250*fa], :cell_style => {:padding => [15*fa,0,15*fa,15*fa]})
      table([["<font size='112'>用地单位\n项目负责人</font>", "#{xmfzr}",  "<font size='112'>联系电话</font>", "#{lxdh}"],
             ["<font size='112'>跟踪管理\n单　　位</font>", "#{gldw}",  "<font size='112'>举报电话</font>", "#{jbdh}"]], 
             :position => :center, :width => 480*fa, :column_widths => [90*fa, 140*fa, 90*fa, 160*fa], :cell_style => {:padding => [15*fa,0,15*fa,15*fa],:valign => :center,:inline_format => true})
          
          
  end

end

gen_pdf(ARGV[0])

$conn.close